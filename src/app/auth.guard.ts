import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../app/api.service';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    router.navigate(['/profile']);
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
