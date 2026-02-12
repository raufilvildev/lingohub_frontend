import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { UsersService } from '../services/users-service';

export const authGuard = (layout: 'public' | 'private'): CanActivateFn => {
  /* 
  ----------------------------------------------------------------------------------------------------
      1. Probamos si el access_token es válido.
      2. Si no es válido, hacemos refresh y volvemos a intentar ver si el access_token es válido.
      3. Aplicamos la siguiente lógica:
        a. Si el layout es 'public' y no estamos autenticados, devolvemos true.
        b. Si el layout es 'public' y estamos autenticados, devolvemos false y redirijimos a /dashboard.
        c. Si el layout es 'private' y estamos autenticados, devolvemos true.
        d. Si el layout es 'private' y no estamos autenticados, devolvemos false y redirijimos a /.
  ----------------------------------------------------------------------------------------------------
  */

  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const authService = inject(AuthService);
    const usersService = inject(UsersService);
    const router = inject(Router);

    let isAuthenticated: boolean = await authService.isAccessTokenValid();

    if (!isAuthenticated) {
      await authService.refresh();
      isAuthenticated = await authService.isAccessTokenValid();
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
        usersService.getMyUser();
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    }
  };
};
