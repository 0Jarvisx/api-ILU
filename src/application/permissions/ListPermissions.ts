import { IPermissionRepository } from '@/domain/auth/ports/IPermissionRepository';
import { Permission } from '@/domain/auth/Permission';
import { PaginationParams, PaginatedResult, paginatedResponse } from '@/utils/pagination';

export class ListPermissions {
  private permissionRepository: IPermissionRepository;
  constructor({ permissionRepository }: { permissionRepository: IPermissionRepository }) {
    this.permissionRepository = permissionRepository;
  }
  async execute(params: PaginationParams): Promise<PaginatedResult<Permission>> {
    const { data, total } = await this.permissionRepository.findPaginated(params, ['name', 'createdAt']);
    return paginatedResponse(data, total, params);
  }
}
