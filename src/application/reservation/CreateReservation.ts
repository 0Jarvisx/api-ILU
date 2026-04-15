import crypto from 'crypto';
import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { IReservationRepository } from '@/domain/reservation/ports/IReservationRepository';
import { IGuestRepository } from '@/domain/guest/ports/IGuestRepository';
import { Reservation } from '@/domain/reservation/Reservation';
import { RoomNotFoundError } from '@/domain/reservation/errors';
import { calculateNightlyPrices } from '@/domain/pricing/PricingEngine';

export interface CreateReservationInput {
  roomId: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string | null;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestCount: number;
  notes?: string | null;
  userId?: number | null;
}

export class CreateReservation {
  constructor(
    private roomRepository: IRoomRepository,
    private reservationRepository: IReservationRepository,
    private guestRepository: IGuestRepository,
  ) {}

  async execute(input: CreateReservationInput): Promise<Reservation> {
    const checkInDate = new Date(input.checkIn);
    const checkOutDate = new Date(input.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('Fechas inválidas. Usa el formato YYYY-MM-DD');
    }
    if (checkInDate >= checkOutDate) {
      throw new Error('checkOut debe ser posterior a checkIn');
    }

    const room = await this.roomRepository.findRoomById(input.roomId);
    if (!room || !room.isActive) throw new RoomNotFoundError(input.roomId);

    // Validate guest count against room type capacity
    const maxCapacity = room.roomType?.maxCapacity;
    if (maxCapacity !== undefined && input.guestCount > maxCapacity) {
      throw new Error(
        `La habitación soporta máximo ${maxCapacity} persona(s), solicitaste ${input.guestCount}`,
      );
    }

    const guest = await this.guestRepository.upsertByEmail({
      firstName: input.guestFirstName,
      lastName: input.guestLastName,
      email: input.guestEmail,
      phone: input.guestPhone,
    });

    const basePricePerNight = room.roomType?.basePricePerNight ?? 0;
    const { nights, total } = calculateNightlyPrices(basePricePerNight, checkInDate, checkOutDate);

    const confirmationCode = 'RES-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    return this.reservationRepository.createWithPrices(
      {
        confirmationCode,
        guestId: guest.id,
        roomId: room.id,
        userId: input.userId ?? null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestCount: input.guestCount,
        totalPrice: total,
        notes: input.notes,
      },
      nights,
    );
  }
}
