import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard = (layout: 'public' | 'private'): CanActivateFn => {
  /* 
  ----------------------------------------------------------------------------------------------------
      1. Si el layout es 'public' y no estamos autenticados, devolvemos true.
      2. Si el layout es 'public' y estamos autenticados, devolvemos false y redirijimos a /dashboard.
      3. Si el layout es 'private' y estamos autenticados, devolvemos true.
      4. Si el layout es 'private' y no estamos autenticados, devolvemos false y redirijimos a /.
  ----------------------------------------------------------------------------------------------------
  */

  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const accessToken: string | null = authService.getAccessToken();
    const isAuthenticated = accessToken ? await authService.isAccessTokenValid() : false;

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
