import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // ✅ AGREGADO: Validación explícita con mensajes claros
    if (!user) {
      console.log('❌ RolesGuard: No hay usuario en el request');
      throw new ForbiddenException('Usuario no autenticado');
    }

    if (!user.rol) {
      console.log('❌ RolesGuard: Usuario no tiene campo rol');
      console.log('🔍 Usuario completo:', JSON.stringify(user, null, 2));
      throw new ForbiddenException('Usuario no tiene rol asignado');
    }

    console.log('🔍 RolesGuard - Usuario:', user.username || user.email);
    console.log('🔍 RolesGuard - Rol del usuario:', user.rol);
    console.log('🔍 RolesGuard - Roles requeridos:', requiredRoles);

    const hasRole = requiredRoles.some((role) => user.rol === role);
    
    console.log('✅ RolesGuard - ¿Tiene permiso?:', hasRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Se requiere uno de estos roles: ${requiredRoles.join(', ')}. Tu rol actual: ${user.rol}`
      );
    }

    return true;
  }
}