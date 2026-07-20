import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для захисту маршрутів, що вимагають авторизації
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    // Користувач автентифікований - перевіряємо роль якщо потрібно
    const requiredRole = route.data['role'];
    if (requiredRole) {
      return authService.hasRole(requiredRole);
    }
    return true;
  }

  console.warn('🚫 AuthGuard: Доступ заборонено (токен відсутній). Перенаправлення на /login');
  localStorage.setItem('redirectAfterLogin', state.url);
  router.navigate(['/login']);
  return false;
};

/**
 * Guard для сторінки логіну - перенаправляє на dashboard якщо користувач вже авторизований
 */
export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/admin';
    localStorage.removeItem('redirectAfterLogin');
    router.navigate([redirectUrl]);
    return false;
  }

  return true;
};
