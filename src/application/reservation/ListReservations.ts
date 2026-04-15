import { IReservationRepository, ReservationFilters } from '@/domain/reservation/ports/IReservationRepository';
import { Reservation } from '@/domain/reservation/Reservation';
import { PaginationParams } from '@/utils/pagination';

export class ListReservations {
  private static readonly ALLOWED_ORDER_FIELDS = ['createdAt', 'checkIn', 'checkOut', 'status', 'totalPrice'];

  constructor(private reservationRepository: IReservationRepository) {}

  async execute(
    params: PaginationParams,
    filters: ReservationFilters = {},
  ): Promise<{ data: Reservation[]; total: number }> {
    return this.reservationRepository.findPaginated(params, filters, ListReservations.ALLOWED_ORDER_FIELDS);
  }
}
