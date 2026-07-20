import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from './enums/admin-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(`roles`, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      this.logger.warn(`❌ Доступ заборонено: користувач ${user.email} не має необхідної ролі. Потрібно: ${requiredRoles.join(', ')}`);
    }

    return hasRole;
  }
}
