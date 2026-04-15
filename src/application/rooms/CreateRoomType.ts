import { IRoomRepository, CreateRoomTypeData } from '@/domain/room/ports/IRoomRepository';
import { RoomType } from '@/domain/room/RoomType';

export class CreateRoomType {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(data: CreateRoomTypeData): Promise<RoomType> {
    return this.roomRepository.saveRoomType(data);
  }
}
