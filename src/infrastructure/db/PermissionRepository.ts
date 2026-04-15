import { IPermissionRepository, CreatePermissionData } from '@/domain/auth/ports/IPermissionRepository';
import { Permission } from '@/domain/auth/Permission';
import { PaginationParams } from '@/utils/pagination';
import prisma from '@/config/prisma';

const cache = new Map<string, string[]>();

function toEntity(record: {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
}): Permission {
  return new Permission(record);
}

export class PermissionRepository implements IPermissionRepository {
  async getPermissionsByRole(roleName: string): Promise<string[]> {
    if (cache.has(roleName)) return cache.get(roleName)!;

    const role = await prisma.role.findUnique({
      where: { name: roleName },
      include: {
        permissions: {
          include: { permission: { select: { name: true } } },
        },
      },
    });

    const perms = role?.permissions.map(rp => rp.permission.name) ?? [];
    cache.set(roleName, perms);
    return perms;
  }

  invalidateCache(roleName?: string): void {
    if (roleName) {
      cache.delete(roleName);
    } else {
      cache.clear();
    }
  }

  async findPaginated(
    params: PaginationParams,
    allowedOrderFields: string[],
  ): Promise<{ data: Permission[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'name';

    const [records, total] = await Promise.all([
      prisma.permission.findMany({
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
      }),
      prisma.permission.count(),
    ]);

    return { data: records.map(toEntity), total };
  }

  async findById(id: number): Promise<Permission | null> {
    const record = await prisma.permission.findUnique({ where: { id } });
    if (!record) return null;
    return toEntity(record);
  }

  async create(data: CreatePermissionData): Promise<Permission> {
    const record = await prisma.permission.create({ data });
    return toEntity(record);
  }

  async update(id: number, data: Partial<CreatePermissionData>): Promise<Permission> {
    const record = await prisma.permission.update({ where: { id }, data });
    this.invalidateCache();
    return toEntity(record);
  }

  async delete(id: number): Promise<void> {
    await prisma.permission.delete({ where: { id } });
    this.invalidateCache();
  }
}
