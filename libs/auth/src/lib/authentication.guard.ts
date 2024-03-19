import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { CredentialsService } from './credentials.service';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  const credentialsService = inject(CredentialsService);
  const router = inject(Router);
  if (credentialsService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login'], {
      queryParams: { redirect: state.url },
      replaceUrl: true,
    });
    return false;
  }
};
