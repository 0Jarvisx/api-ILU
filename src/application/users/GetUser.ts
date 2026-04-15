import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';

export class GetUser {
  private userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }
  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error(`Usuario no encontrado: ${id}`);
    return user;
  }
}
