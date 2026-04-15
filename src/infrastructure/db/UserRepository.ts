import { IUserRepository, CreateUserData, UpdateUserData } from '@/domain/auth/ports/IUserRepository';
import { User } from '@/domain/auth/User';
import { PaginationParams } from '@/utils/pagination';
import prisma from '@/config/prisma';

const userWithRole = {
  include: {
    role: {
      select: {
        id: true,
        name: true,
        permissions: {
          select: { permission: { select: { id: true, name: true } } },
        },
      },
    },
  },
} as const;

function toEntity(record: any): User {
  return new User({
    ...record,
    role: {
      id: record.role.id,
      name: record.role.name,
      permissions: record.role.permissions.map((rp: any) => rp.permission),
    },
  });
}

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id }, ...userWithRole });
    if (!record) return null;
    return toEntity(record);
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email }, ...userWithRole });
    if (!record) return null;
    return toEntity(record);
  }

  async findPaginated(
    params: PaginationParams,
    allowedOrderFields: string[],
  ): Promise<{ data: User[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'createdAt';

    const where: Record<string, unknown> = {};

    const { isActive, email, roleId } = (params.filters ?? {}) as { isActive?: string; email?: string; roleId?: string };

    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (roleId) where.roleId = Number(roleId);

    const [records, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
        ...userWithRole,
      }),
      prisma.user.count({ where }),
    ]);

    return { data: records.map(toEntity), total };
  }

  async save(data: CreateUserData): Promise<User> {
    const record = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dpi: data.dpi,
      },
      ...userWithRole,
    });
    return toEntity(record);
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const record = await prisma.user.update({
      where: { id },
      data,
      ...userWithRole,
    });
    return toEntity(record);
  }

  async deactivate(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateLastLogin(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  async findRoleIdByName(name: string): Promise<number> {
    const role = await prisma.role.findUniqueOrThrow({ where: { name } });
    return role.id;
  }
}
