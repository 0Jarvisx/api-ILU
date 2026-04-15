import bcrypt from 'bcryptjs';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';

interface RegisterDeps {
  userRepository: IUserRepository;
}

interface RegisterParams {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dpi?: string | null;
}

const BCRYPT_ROUNDS = 10;

function validatePassword(password: string): void {
  if (password.length < 8)          throw new Error('La contraseña debe tener al menos 8 caracteres');
  if (!/[A-Z]/.test(password))      throw new Error('La contraseña debe tener al menos una mayúscula');
  if (!/[0-9]/.test(password))      throw new Error('La contraseña debe tener al menos un número');
  if (!/[^A-Za-z0-9]/.test(password)) throw new Error('La contraseña debe tener al menos un carácter especial');
}

export class Register {
  private userRepository: IUserRepository;

  constructor({ userRepository }: RegisterDeps) {
    this.userRepository = userRepository;
  }

  async execute({ email, password, firstName, lastName, phone, dpi }: RegisterParams): Promise<User> {
    validatePassword(password);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('El email ya está registrado');
    }

    const [passwordHash, roleId] = await Promise.all([
      bcrypt.hash(password, BCRYPT_ROUNDS),
      this.userRepository.findRoleIdByName('guest'),
    ]);

    return this.userRepository.save({ email, passwordHash, roleId, firstName, lastName, phone, dpi });
  }
}
