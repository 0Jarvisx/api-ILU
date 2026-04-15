import { IRoleRepository } from '@/domain/auth/ports/IRoleRepository';
import { Role } from '@/domain/auth/Role';

export class GetRole {
  private roleRepository: IRoleRepository;
  constructor({ roleRepository }: { roleRepository: IRoleRepository }) {
    this.roleRepository = roleRepository;
  }
  async execute(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new Error(`Rol no encontrado: ${id}`);
    return role;
  }
}
