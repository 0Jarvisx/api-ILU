import { User } from '@/domain/auth/User';
import { PaginationParams } from '@/utils/pagination';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  roleId: number;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dpi?: string | null;
}

export interface UpdateUserData {
  email?: string;
  roleId?: number;
  isActive?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  dpi?: string | null;
}

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findPaginated(params: PaginationParams, allowedOrderFields: string[]): Promise<{ data: User[]; total: number }>;
  save(data: CreateUserData): Promise<User>;
  update(id: number, data: UpdateUserData): Promise<User>;
  deactivate(id: number): Promise<void>;
  updateLastLogin(id: number): Promise<void>;
  findRoleIdByName(name: string): Promise<number>;
}
