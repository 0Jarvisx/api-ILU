import bcrypt from 'bcryptjs';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { ITokenPort } from '@/domain/auth/ports/ITokenPort';
import { RoleName } from '@/domain/auth/User';

interface LoginDeps {
  userRepository: IUserRepository;
  tokenPort: ITokenPort;
}

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  user: {
    id: number;
    email: string;
    role: {
      id: number;
      name: RoleName;
      permissions: Array<{ id: number; name: string }>;
    };
  };
}

export class Login {
  private userRepository: IUserRepository;
  private tokenPort: ITokenPort;

  constructor({ userRepository, tokenPort }: LoginDeps) {
    this.userRepository = userRepository;
    this.tokenPort = tokenPort;
  }

  async execute({ email, password }: LoginParams): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new Error('Tu cuenta está desactivada. Comunícate con soporte técnico.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Credenciales inválidas');
    }

    await this.userRepository.updateLastLogin(user.id);

    const roleName = user.role?.name as RoleName;
    const token = this.tokenPort.sign({ sub: user.id, email: user.email, role: roleName });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: {
          id: user.role!.id,
          name: roleName,
          permissions: user.role!.permissions ?? [],
        },
      },
    };
  }
}
