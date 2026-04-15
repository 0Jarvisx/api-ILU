import { Permission } from '@/domain/auth/Permission';
import { PaginationParams } from '@/utils/pagination';

export interface CreatePermissionData {
  name: string;
  description?: string;
}

export interface IPermissionRepository {
  // Usados por can() middleware
  getPermissionsByRole(roleName: string): Promise<string[]>;
  invalidateCache(roleName?: string): void;

  // CRUD
  findPaginated(params: PaginationParams, allowedOrderFields: string[]): Promise<{ data: Permission[]; total: number }>;
  findById(id: number): Promise<Permission | null>;
  create(data: CreatePermissionData): Promise<Permission>;
  update(id: number, data: Partial<CreatePermissionData>): Promise<Permission>;
  delete(id: number): Promise<void>;
}
