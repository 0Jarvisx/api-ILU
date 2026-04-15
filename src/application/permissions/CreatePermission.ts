import { IPermissionRepository, CreatePermissionData } from '@/domain/auth/ports/IPermissionRepository';
import { Permission } from '@/domain/auth/Permission';

export class CreatePermission {
  private permissionRepository: IPermissionRepository;
  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.permissionRepository = permissionRepository;
  }
  async execute(data: CreatePermissionData): Promise<Permission> {
    return this.permissionRepository.create(data);
  }
}
