import { IRoleRepository } from '@/domain/auth/ports/IRoleRepository';
import { Role } from '@/domain/auth/Role';
import { PaginationParams, PaginatedResult, paginatedResponse } from '@/utils/pagination';

export class ListRoles {
  private roleRepository: IRoleRepository;
  constructor({ roleRepository }: { roleRepository: IRoleRepository }) {
    this.roleRepository = roleRepository;
  }
  async execute(params: PaginationParams): Promise<PaginatedResult<Role>> {
    const { data, total } = await this.roleRepository.findPaginated(params, ['name', 'createdAt']);
    return paginatedResponse(data, total, params);
  }
}
