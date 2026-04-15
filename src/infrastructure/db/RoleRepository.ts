import { IRoleRepository, CreateRoleData, UpdateRoleData } from '@/domain/auth/ports/IRoleRepository';
import { Role } from '@/domain/auth/Role';
import { PaginationParams } from '@/utils/pagination';
import prisma from '@/config/prisma';

function toEntity(record: {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  permissions?: Array<{ permission: { id: number; name: string } }>;
}): Role {
  return new Role({
    ...record,
    permissions: record.permissions?.map(rp => rp.permission),
  });
}

export class RoleRepository implements IRoleRepository {
  async findPaginated(
    params: PaginationParams,
    allowedOrderFields: string[],
  ): Promise<{ data: Role[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'name';

    const [records, total] = await Promise.all([
      prisma.role.findMany({
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
      }),
      prisma.role.count(),
    ]);

    return { data: records.map(toEntity), total };
  }

  async findById(id: number): Promise<Role | null> {
    const record = await prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: { select: { id: true, name: true } } } } },
    });
    if (!record) return null;
    return toEntity(record);
  }

  async save(data: CreateRoleData): Promise<Role> {
    const record = await prisma.role.create({ data });
    return toEntity(record);
  }

  async update(id: number, data: UpdateRoleData): Promise<Role> {
    const record = await prisma.role.update({ where: { id }, data });
    return toEntity(record);
  }

  async delete(id: number): Promise<void> {
    await prisma.role.delete({ where: { id } });
  }

  async assignPermissions(roleId: number, permissionIds: number[]): Promise<void> {
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.rolePermission.createMany({
        data: permissionIds.map(permissionId => ({ roleId, permissionId })),
        skipDuplicates: true,
      }),
    ]);
  }
}
