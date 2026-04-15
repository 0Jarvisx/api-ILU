import { IRoomRepository, UpdateRoomTypeData } from '@/domain/room/ports/IRoomRepository';
import { RoomType } from '@/domain/room/RoomType';

export class UpdateRoomType {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number, data: UpdateRoomTypeData): Promise<RoomType> {
    const existing = await this.roomRepository.findRoomTypeById(id);
    if (!existing) throw new Error(`Tipo de habitación no encontrado: ${id}`);
    return this.roomRepository.updateRoomType(id, data);
  }
}
