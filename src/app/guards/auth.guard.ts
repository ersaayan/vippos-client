import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (localStorage.getItem('accessToken')) {
    if (authService.isLoggedIn()) {
      return true;
    } else {
      authService.logout();
      router.navigate(['login']);
      return false; // Navigasyon sonrasında false dönmek daha güvenli
    }
  } else {
    authService.logout();
    router.navigate(['login']);
    return false; // Navigasyon sonrasında false dönmek daha güvenli
  }
};
