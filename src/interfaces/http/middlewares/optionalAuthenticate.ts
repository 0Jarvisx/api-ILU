import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '@/infrastructure/auth/JwtAdapter';

const jwtAdapter = new JwtAdapter();

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const token: string | undefined =
    req.cookies?.access_token ??
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined);

  if (token) {
    try {
      const payload = jwtAdapter.verify(token);
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
    } catch {
      // Token inválido — se ignora y se continúa sin usuario
    }
  }

  next();
}
