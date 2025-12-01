import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado (caché), permitir inmediatamente
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no, esperar a que Firebase Auth termine de verificar
  return authService.authReady$.pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado y es admin (caché), permitir inmediatamente
  if (authService.isAuthenticated() && authService.hasRole('admin')) {
    return true;
  }

  // Si no, esperar a que Firebase Auth termine de verificar
  return authService.authReady$.pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (authService.isAuthenticated() && authService.hasRole('admin')) {
        return true;
      }
      router.navigate(['/portafolios']);
      return false;
    })
  );
};

export const programadorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya está autenticado y es programador (caché), permitir inmediatamente
  if (authService.isAuthenticated() && authService.hasRole('programador')) {
    return true;
  }

  // Si no, esperar a que Firebase Auth termine de verificar
  return authService.authReady$.pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (authService.isAuthenticated() && authService.hasRole('programador')) {
        return true;
      }
      router.navigate(['/portafolios']);
      return false;
    })
  );
};