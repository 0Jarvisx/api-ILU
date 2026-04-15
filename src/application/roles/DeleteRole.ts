import { IRoleRepository } from '@/domain/auth/ports/IRoleRepository';

export class DeleteRole {
  private roleRepository: IRoleRepository;
  constructor({ roleRepository }: { roleRepository: IRoleRepository }) {
    this.roleRepository = roleRepository;
  }
  async execute(id: number): Promise<void> {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new Error(`Rol no encontrado: ${id}`);
    return this.roleRepository.delete(id);
  }
}
