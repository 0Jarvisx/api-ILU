import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { RoomType } from '@/domain/room/RoomType';

export class SetRoomTypeAmenities {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(roomTypeId: number, amenityIds: number[]): Promise<RoomType> {
    const roomType = await this.roomRepository.findRoomTypeById(roomTypeId);
    if (!roomType) throw new Error(`Tipo de habitación no encontrado: ${roomTypeId}`);
    return this.roomRepository.setRoomTypeAmenities({ roomTypeId, amenityIds });
  }
}
