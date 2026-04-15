import { IUserRepository } from '@/domain/auth/ports/IUserRepository';

export class DeleteUser {
  private userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }
  async execute(id: number): Promise<void> {
    const existing = await this.userRepository.findById(id);
    if (!existing) throw new Error(`Usuario no encontrado: ${id}`);
    await this.userRepository.deactivate(id);
  }
}
