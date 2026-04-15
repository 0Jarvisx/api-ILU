import { IRoleRepository } from '@/domain/auth/ports/IRoleRepository';
import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';

interface AssignRolePermissionsDeps {
  roleRepository: IRoleRepository;
  permissionRepository: IPermissionRepository;
}

export class AssignRolePermissions {
  private roleRepository: IRoleRepository;
  private permissionRepository: IPermissionRepository;

  constructor({ roleRepository, permissionRepository }: AssignRolePermissionsDeps) {
    this.roleRepository = roleRepository;
    this.permissionRepository = permissionRepository;
  }

  async execute(roleId: number, permissionIds: number[]): Promise<void> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) throw new Error(`Rol no encontrado: ${roleId}`);

    await this.roleRepository.assignPermissions(roleId, permissionIds);

    // Invalida el caché para que el middleware can() refleje los cambios inmediatamente
    this.permissionRepository.invalidateCache(role.name);
  }
}
