import { Request, Response, NextFunction } from 'express';
import { PermissionRepository } from '@/infrastructure/db/PermissionRepository';

// Instancia singleton — comparte el caché con todos los usos del middleware
const permissionRepository = new PermissionRepository();

/**
 * Middleware de autorización por permiso.
 * Uso: can('reservation:create') | can('stats:read', 'calendar:read')
 * Debe usarse siempre después de authenticate.
 *
 * @example
 * router.post('/', authenticate, can('reservation:create'), controller.create);
 */
export function can(...required: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const role = req.user?.role;

    if (!role) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    const userPerms = await permissionRepository.getPermissionsByRole(role);
    const allowed = required.every(p => userPerms.includes(p));

    if (!allowed) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
}

export { permissionRepository };
