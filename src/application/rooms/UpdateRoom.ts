import { IRoomRepository, UpdateRoomData } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';

export class UpdateRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number, data: UpdateRoomData): Promise<Room> {
    const existing = await this.roomRepository.findRoomById(id);
    if (!existing) throw new Error(`Habitación no encontrada: ${id}`);
    return this.roomRepository.updateRoom(id, data);
  }
}
