import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CredentialsService } from './credentials.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the authentication token from the AuthService
  const authToken = inject(CredentialsService).credentials?.access_token;
  // Clone the request and add the Authorization header with the token

  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
