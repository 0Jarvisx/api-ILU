import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';

export class DeletePermission {
  private permissionRepository: IPermissionRepository;
  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.permissionRepository = permissionRepository;
  }
  async execute(id: number): Promise<void> {
    const existing = await this.permissionRepository.findById(id);
    if (!existing) throw new Error(`Permiso no encontrado: ${id}`);
    return this.permissionRepository.delete(id);
  }
}
