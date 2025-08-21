import { inject } from '@angular/core';
import { Router, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const notAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuthenticated = await firstValueFrom(authService.checkStatus())
  if(isAuthenticated){
    router.navigateByUrl("/");
    return false;
  }
  console.log("notAuthenticatedGuard");
  console.log({isAuthenticated})
  return true;
};
