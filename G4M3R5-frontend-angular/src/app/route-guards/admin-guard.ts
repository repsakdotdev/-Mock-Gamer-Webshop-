import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const isAdmin: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isAdminUser().pipe(
    map(isAdmin => {
      if (isAdmin) {
        return true;
      }
      // Redirect to home if not an admin
      return router.createUrlTree(['/']);
    })
  );
};