import { RoleName } from '@/domain/auth/User';
import { PaginationParams } from '@/utils/pagination';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: RoleName;
    };
    pagination?: PaginationParams;
  }
}
