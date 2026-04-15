import { IUserRepository, UpdateUserData } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';

export class UpdateUser {
  private userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }
  async execute(id: number, data: UpdateUserData): Promise<User> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new Error(`Usuario no encontrado: ${id}`);
    return this.userRepository.update(id, data);
  }
}
