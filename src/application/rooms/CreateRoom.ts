import { IRoomRepository, CreateRoomData } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';

export class CreateRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(data: CreateRoomData): Promise<Room> {
    return this.roomRepository.saveRoom(data);
  }
}
