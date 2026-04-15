import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';
import { Permission } from '@/domain/auth/Permission';

export class GetPermission {
  private permissionRepository: IPermissionRepository;
  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.permissionRepository = permissionRepository;
  }
  async execute(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) throw new Error(`Permiso no encontrado: ${id}`);
    return permission;
  }
}
