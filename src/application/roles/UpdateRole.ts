import { IRoleRepository, UpdateRoleData } from '@/domain/auth/ports/IRoleRepository';
import { Role } from '@/domain/auth/Role';

export class UpdateRole {
  private roleRepository: IRoleRepository;
  constructor({ roleRepository }: { roleRepository: IRoleRepository }) {
    this.roleRepository = roleRepository;
  }
  async execute(id: number, data: UpdateRoleData): Promise<Role> {
    const existing = await this.roleRepository.findById(id);
    if (!existing) throw new Error(`Rol no encontrado: ${id}`);
    return this.roleRepository.update(id, data);
  }
}
