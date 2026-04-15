import { IUserRepository } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';
import { PaginationParams, PaginatedResult, paginatedResponse } from '@/utils/pagination';

export interface UserFilters extends Record<string, unknown> {
  isActive?: string;
  email?: string;
  roleId?: string;
}

export class ListUsers {
  private userRepository: IUserRepository;
  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }
  async execute(params: PaginationParams, filters: UserFilters = {}): Promise<PaginatedResult<User>> {
    const paramsWithFilters = { ...params, filters };
    const { data, total } = await this.userRepository.findPaginated(paramsWithFilters, ['email', 'createdAt', 'isActive']);
    return paginatedResponse(data, total, params);
  }
}
