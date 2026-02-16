import { inject } from '@angular/core';
import { CanMatchFn, Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const isAuthenticated: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      // Redirect to login if not authenticated
      return router.createUrlTree(['/login']);
    })
  );
};

export const isNotAuthenticated: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        return true;
      }
      // Redirect to dashboard/home if already authenticated
      return router.createUrlTree(['/dashboard']); // or any other page you want to redirect to
    })
  );
};

// Add the authGuard function that implements CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isLoggedIn().pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      }
      // Redirect to login page
      window.location.href = '/login';
      return false;
    })
  );
};
