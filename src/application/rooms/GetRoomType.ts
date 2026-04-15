import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { RoomType } from '@/domain/room/RoomType';

export class GetRoomType {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number): Promise<RoomType> {
    const roomType = await this.roomRepository.findRoomTypeById(id);
    if (!roomType) throw new Error(`Tipo de habitación no encontrado: ${id}`);
    return roomType;
  }
}
