import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const AuthenticationGuard: CanActivateFn = (route, state) => {
  // Check if the user is authenticated
  if (inject(AuthService).isLoggedIn()) {
    return true; // Allow navigation
  } else {
    // If not authenticated, redirect to login page
    // Note: This assumes you have a route named 'login' configured in your router
    // You may need to adjust the route name based on your application's routing configuration
    inject(Router).navigate(['/login']);
    return false; // Block navigation
  }
};
