import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DOCUMENT } from '@angular/common';
import * as jwt_decode from 'jwt-decode';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorage = inject(DOCUMENT).defaultView?.localStorage;

  if (localStorage && localStorage.getItem('accessToken')) {
    const token = localStorage.getItem('accessToken')!;

    const decodedToken: jwt_decode.JwtPayload = jwt_decode.jwtDecode(token);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedToken.exp && decodedToken.exp > currentTimestamp) {
      const userRole = authService.getUserRole();
      const allowedRoles = route.firstChild?.data?.['allowedRoles'] as Array<string>;
      const allowedRoles2 = route.data?.['allowedRoles'] as Array<string>;

      if (userRole && allowedRoles && allowedRoles.includes(userRole) || userRole && allowedRoles2 && allowedRoles2.includes(userRole)) {
        return true;
      } else {
        router.navigate(['access-denied']);
        return false;
      }
    } else {
      authService.logout();
      router.navigate(['login']);
      return false;
    }
  } else {
    router.navigate(['login']);
    return false;
  }
};
