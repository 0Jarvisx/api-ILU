import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';

export class GetRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number): Promise<Room> {
    const room = await this.roomRepository.findRoomById(id);
    if (!room) throw new Error(`Habitación no encontrada: ${id}`);
    return room;
  }
}
