import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '@/infrastructure/auth/JwtAdapter';

const jwtAdapter = new JwtAdapter();

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  // Primero busca en cookie httpOnly, luego en Authorization header (Postman/curl)
  const token: string | undefined =
    req.cookies?.access_token ??
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined);

  if (!token) {
    res.status(401).json({ error: 'Token de autorización requerido' });
    return;
  }

  try {
    const payload = jwtAdapter.verify(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
