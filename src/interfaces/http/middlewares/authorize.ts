import { Request, Response, NextFunction } from 'express';
import { RoleName } from '@/domain/auth/User';

/**
 * Middleware de autorización por rol.
 * Uso: authorize('admin') | authorize('admin', 'receptionist')
 * Debe usarse siempre después de authenticate.
 */
export function authorize(...roles: RoleName[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'No autenticado' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'No tienes permisos para esta acción' });
      return;
    }

    next();
  };
}
