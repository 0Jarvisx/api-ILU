import { IGuestRepository, CreateGuestData } from '@/domain/guest/ports/IGuestRepository';
import { Guest } from '@/domain/guest/Guest';
import prisma from '@/config/prisma';

function toEntity(r: any): Guest {
  return new Guest(r);
}

export class GuestRepository implements IGuestRepository {
  async findByEmail(email: string): Promise<Guest | null> {
    const r = await prisma.guest.findUnique({ where: { email } });
    return r ? toEntity(r) : null;
  }

  async findById(id: number): Promise<Guest | null> {
    const r = await prisma.guest.findUnique({ where: { id } });
    return r ? toEntity(r) : null;
  }

  async upsertByEmail(data: CreateGuestData): Promise<Guest> {
    const r = await prisma.guest.upsert({
      where: { email: data.email },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? null,
      },
      create: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? null,
      },
    });
    return toEntity(r);
  }
}
