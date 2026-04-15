import { Reservation } from '@/domain/reservation/Reservation';
import { NightlyPrice } from '@/domain/pricing/PricingEngine';
import { PaginationParams } from '@/utils/pagination';

export interface CreateReservationData {
  confirmationCode: string;
  guestId: number;
  roomId: number;
  userId?: number | null;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: number;
  notes?: string | null;
}

export interface ReservationFilters {
  guestId?: number;
  roomId?: number;
  status?: string;
}

export interface IReservationRepository {
  createWithPrices(data: CreateReservationData, nights: NightlyPrice[]): Promise<Reservation>;
  findById(id: number): Promise<Reservation | null>;
  findPaginated(
    params: PaginationParams,
    filters: ReservationFilters,
    allowedOrderFields: string[],
  ): Promise<{ data: Reservation[]; total: number }>;
  cancel(id: number): Promise<Reservation>;
}
