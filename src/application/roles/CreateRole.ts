import { IRoleRepository, CreateRoleData } from '@/domain/auth/ports/IRoleRepository';
import { Role } from '@/domain/auth/Role';

export class CreateRole {
  private roleRepository: IRoleRepository;
  constructor({ roleRepository }: { roleRepository: IRoleRepository }) {
    this.roleRepository = roleRepository;
  }
  async execute(data: CreateRoleData): Promise<Role> {
    return this.roleRepository.save(data);
  }
}
