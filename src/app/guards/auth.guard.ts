import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';
import * as jwt_decode from 'jwt-decode'; // Import for JWT decoding

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorage = inject(DOCUMENT).defaultView?.localStorage;

  if (localStorage && localStorage.getItem('accessToken')) {
    const token = localStorage.getItem('accessToken')!; // Get the token

    // Decode the JWT to get expiration time
    const decodedToken: jwt_decode.JwtPayload = jwt_decode.jwtDecode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp > currentTimestamp) {
      // Token is valid
      return authService.isLoggedIn(); // Check additional login conditions
    } else {
      // Token has expired
      authService.logout();
      router.navigate(['login']);
      return false;
    }
  } else {
    // No token found
    router.navigate(['login']);
    return false;
  }
};
