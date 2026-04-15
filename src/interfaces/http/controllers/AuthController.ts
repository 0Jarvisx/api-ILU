import { Request, Response } from 'express';
import { Login } from '@/application/auth/Login';
import { Register } from '@/application/auth/Register';
import { GetUser } from '@/application/users/GetUser';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { ITokenPort } from '@/domain/auth/ports/ITokenPort';
import env from '@/config/env';

interface AuthControllerDeps {
  userRepository: IUserRepository;
  tokenPort: ITokenPort;
}

const COOKIE_NAME = 'access_token';

const cookieOptions = {
  httpOnly: true,                              // inaccesible desde JS
  secure: env.NODE_ENV === 'production',       // solo HTTPS en producción
  sameSite: 'lax' as const,                   // protección CSRF básica
  maxAge: env.COOKIE_MAX_AGE,
};

export class AuthController {
  private login: Login;
  private register: Register;
  private getUser: GetUser;

  constructor({ userRepository, tokenPort }: AuthControllerDeps) {
    this.login = new Login({ userRepository, tokenPort });
    this.register = new Register({ userRepository });
    this.getUser = new GetUser({ userRepository });
  }

  async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        res.status(400).json({ error: 'email y password son requeridos' });
        return;
      }

      const { token, user } = await this.login.execute({ email, password });

      res.cookie(COOKIE_NAME, token, cookieOptions);
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: (err as Error).message });
    }
  }

  async handleRegister(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone, dpi } = req.body as {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        dpi?: string;
      };

      if (!email || !password) {
        res.status(400).json({ error: 'email y password son requeridos' });
        return;
      }

      const user = await this.register.execute({ email, password, firstName, lastName, phone, dpi });
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dpi: user.dpi,
      });
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  handleLogout(_req: Request, res: Response): void {
    res.clearCookie(COOKIE_NAME, cookieOptions);
    res.json({ message: 'Sesión cerrada' });
  }

  async handleMe(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUser.execute(req.user!.id);
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        dpi: user.dpi,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
      });
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  }
}
