import bcrypt from 'bcryptjs';
import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';

interface CreateUserParams {
  email: string;
  password: string;
  roleId: number;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dpi?: string | null;
}

const BCRYPT_ROUNDS = 10;

export class CreateUser {
  private userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }
  async execute({ email, password, roleId, firstName, lastName, phone, dpi }: CreateUserParams): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error('El email ya está registrado');

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return this.userRepository.save({ email, passwordHash, roleId, firstName, lastName, phone, dpi });
  }
}
