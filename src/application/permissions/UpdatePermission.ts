import { IPermissionRepository, CreatePermissionData } from '@/domain/auth/ports/IPermissionRepository';
import { Permission } from '@/domain/auth/Permission';

export class UpdatePermission {
  private permissionRepository: IPermissionRepository;
  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.permissionRepository = permissionRepository;
  }
  async execute(id: number, data: Partial<CreatePermissionData>): Promise<Permission> {
    const existing = await this.permissionRepository.findById(id);
    if (!existing) throw new Error(`Permiso no encontrado: ${id}`);
    return this.permissionRepository.update(id, data);
  }
}
