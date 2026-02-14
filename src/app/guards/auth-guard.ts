import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { UsersService } from '../services/users-service';
import { IUser } from '../interfaces/users/i-user';

export const authGuard = (layout: 'public' | 'private'): CanActivateFn => {
  /* 
  ----------------------------------------------------------------------------------------------------
      1. Obtenemos el usuario actual utilizando el UsersService. Si el usuario es null, intentamos obtenerlo de nuevo utilizando getMyUser(), que hace una petición al backend para obtener los datos del usuario autenticado. Esto es necesario porque el usuario podría no estar cargado en el frontend pero sí estar autenticado en el backend.
      2. El usuario estará autenticado si el objeto user no es null.
      3. Aplicamos la siguiente lógica:
        a. Si el layout es 'public' y no estamos autenticados, devolvemos true.
        b. Si el layout es 'public' y estamos autenticados, devolvemos false y redirijimos a /dashboard.
        c. Si el layout es 'private' y estamos autenticados, devolvemos true.
        d. Si el layout es 'private' y no estamos autenticados, devolvemos false y redirijimos a /.
  ----------------------------------------------------------------------------------------------------
  */

  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const usersService = inject(UsersService);
    const router = inject(Router);
    let user: IUser | null = null;
    try {
      user = usersService.getUser();
    } catch (error) {
      user = null;
    }

    let isAuthenticated: boolean = user !== null;

    if (!user) {
      try {
        user = await usersService.getMyUser();
      } catch (error) {
        user = null;
      }

      isAuthenticated = user !== null;
    }

    if (layout === 'public') {
      if (!isAuthenticated) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    } else {
      if (isAuthenticated) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    }
  };
};
