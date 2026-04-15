import { Role } from '@/domain/auth/Role';
import { PaginationParams } from '@/utils/pagination';

export interface CreateRoleData {
  name: string;
  description?: string;
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
}

export interface IRoleRepository {
  findPaginated(params: PaginationParams, allowedOrderFields: string[]): Promise<{ data: Role[]; total: number }>;
  findById(id: number): Promise<Role | null>;
  save(data: CreateRoleData): Promise<Role>;
  update(id: number, data: UpdateRoleData): Promise<Role>;
  delete(id: number): Promise<void>;
  assignPermissions(roleId: number, permissionIds: number[]): Promise<void>;
}
