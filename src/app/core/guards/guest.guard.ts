import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    return true;
  }

  // Redirect based on role
  if (authService.isAdmin) {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/']);
  }
  return false;
};