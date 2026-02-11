import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { from, Observable, switchMap } from 'rxjs';

const EXCLUDE_URLS: Record<string, string[]> = {
  GET: [],
  POST: ['users/signup', 'auth/validate', '/auth/login', '/auth/refresh', '/auth/logout'],
  PUT: [],
  DELETE: [],
};

function setAuthorizationHeader(req: HttpRequest<unknown>, access_token: string | null) {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${access_token}` },
  });
}

function refreshAndAttachAccessToken(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> {
  return from(authService.refresh()).pipe(
    switchMap(() => {
      req = setAuthorizationHeader(req, authService.getAccessToken());
      return next(req);
    }),
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  /* 
  ----------------------------------------------------------------------------------------------------
      1. Excluimos del interceptor todas esas urls en EXCLUDE_URLS
      2. Obtenemos el access_token.
      3. Si el access_token no existe, ejecutamos refresh() y ponemos el access_token en la cabecera Authorization.
      4. Si el access_token existe, lo validamos.
      6. Si el access_token no es válido, ejecutamos refresh() y ponemos el access_token en la cabecera Authorization.
      7. Si el access_token es válido, lo ponemos en la cabecera Authorization.
  ----------------------------------------------------------------------------------------------------
  */

  if (EXCLUDE_URLS[req.method]?.some((url) => req.url.includes(url))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const access_token: string | null = authService.getAccessToken();

  if (!access_token) {
    return refreshAndAttachAccessToken(req, next, authService);
  }

  return from(authService.isAccessTokenValid()).pipe(
    switchMap((isValid) => {
      if (!isValid) {
        return refreshAndAttachAccessToken(req, next, authService);
      }

      req = setAuthorizationHeader(req, authService.getAccessToken());
      return next(req);
    }),
  );
};
