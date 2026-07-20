import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard для перевірки ролі користувача
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const currentUserRole = authService.currentUserValue?.role;
  
  if (!currentUserRole) {
    router.navigate(['/login']);
    return false;
  }

  const hasRole = requiredRoles.includes(currentUserRole);
  
  if (!hasRole) {
    console.warn(`🚫 RoleGuard: Доступ заборонено. Роль ${currentUserRole} не має доступу до цього ресурсу`);
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
