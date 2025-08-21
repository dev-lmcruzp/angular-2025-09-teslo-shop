import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async(route, segments) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  await firstValueFrom(authService.checkStatus());


  if(!authService.checkRoles(['admin'])){
    router.navigateByUrl("/auth/login");
    console.log("not admin");
    return false;
  }

  return true;
};
