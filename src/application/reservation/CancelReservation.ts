import { IReservationRepository } from '@/domain/reservation/ports/IReservationRepository';
import { Reservation } from '@/domain/reservation/Reservation';
import { ReservationNotFoundError } from '@/domain/reservation/errors';

export class CancelReservation {
  constructor(private reservationRepository: IReservationRepository) {}

  async execute(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new ReservationNotFoundError(id);
    if (reservation.status === 'CANCELLED') {
      throw new Error('La reservación ya está cancelada');
    }
    return this.reservationRepository.cancel(id);
  }
}
