import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorage = inject(DOCUMENT).defaultView?.localStorage;
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('accessToken')) {
      if (authService.isLoggedIn()) {
        return true;
      } else {
        authService.logout();
        router.navigate(['login']);
        return false;
      }
    } else {
      authService.logout();
      router.navigate(['login']);
      return false;
    }
  } else {
    console.error('localStorage is not defined');
    return false;
  }
};
