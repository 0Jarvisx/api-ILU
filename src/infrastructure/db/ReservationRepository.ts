import { IReservationRepository, CreateReservationData, ReservationFilters } from '@/domain/reservation/ports/IReservationRepository';
import { Reservation, ReservationStatus } from '@/domain/reservation/Reservation';
import { RoomNotAvailableError } from '@/domain/reservation/errors';
import { NightlyPrice } from '@/domain/pricing/PricingEngine';
import { PaginationParams } from '@/utils/pagination';
import prisma from '@/config/prisma';

const RESERVATION_INCLUDE = {
  nightlyPrices: true,
  room: {
    include: { roomType: true }
  }
} as const;

function toEntity(r: any): Reservation {
  return new Reservation({
    ...r,
    totalPrice: Number(r.totalPrice),
    nightlyPrices: r.nightlyPrices?.map((n: any) => ({ ...n, price: Number(n.price) })) ?? [],
    room: r.room
  });
}

export class ReservationRepository implements IReservationRepository {
  async createWithPrices(data: CreateReservationData, nights: NightlyPrice[]): Promise<Reservation> {
    try {
      let created: any;

      await prisma.$transaction(async (tx) => {
        created = await tx.reservation.create({
          data: {
            confirmationCode: data.confirmationCode,
            guestId: data.guestId,
            roomId: data.roomId,
            userId: data.userId ?? null,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            guestCount: data.guestCount,
            totalPrice: data.totalPrice,
            notes: data.notes ?? null,
          },
          include: RESERVATION_INCLUDE,
        });

        await tx.reservationNightlyPrice.createMany({
          data: nights.map((n) => ({
            reservationId: created.id,
            date: n.date,
            price: n.price,
          })),
        });
      });

      // Reload with nightlyPrices after createMany
      const full = await prisma.reservation.findUniqueOrThrow({
        where: { id: created.id },
        include: RESERVATION_INCLUDE,
      });

      return toEntity(full);
    } catch (err: any) {
      if (
        err?.code === 'P2010' ||
        (err?.message && err.message.includes('23P01')) ||
        (err?.meta?.code === '23P01')
      ) {
        throw new RoomNotAvailableError();
      }
      throw err;
    }
  }

  async findById(id: number): Promise<Reservation | null> {
    const r = await prisma.reservation.findUnique({
      where: { id },
      include: RESERVATION_INCLUDE,
    });
    return r ? toEntity(r) : null;
  }

  async findPaginated(
    params: PaginationParams,
    filters: ReservationFilters,
    allowedOrderFields: string[],
  ): Promise<{ data: Reservation[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'createdAt';

    const where: any = {};
    if (filters.guestId !== undefined) where.guestId = filters.guestId;
    if (filters.roomId !== undefined) where.roomId = filters.roomId;
    if (filters.status !== undefined) where.status = filters.status;

    const [records, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
        include: RESERVATION_INCLUDE,
      }),
      prisma.reservation.count({ where }),
    ]);

    return { data: records.map(toEntity), total };
  }

  async cancel(id: number): Promise<Reservation> {
    const r = await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' as ReservationStatus },
      include: RESERVATION_INCLUDE,
    });
    return toEntity(r);
  }
}
