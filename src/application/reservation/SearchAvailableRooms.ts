import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';

export interface SearchAvailableRoomsInput {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guestCount: number;
}

export class SearchAvailableRooms {
  constructor(private roomRepository: IRoomRepository) {}

  async execute({ checkIn, checkOut, guestCount }: SearchAvailableRoomsInput): Promise<Room[]> {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new Error('Fechas inválidas. Usa el formato YYYY-MM-DD');
    }
    if (checkInDate >= checkOutDate) {
      throw new Error('checkOut debe ser posterior a checkIn');
    }
    if (guestCount < 1) {
      throw new Error('guestCount debe ser al menos 1');
    }

    return this.roomRepository.findAvailableRooms({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount,
    });
  }
}
