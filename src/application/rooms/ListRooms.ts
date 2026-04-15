import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';
import { PaginationParams, PaginatedResult, paginatedResponse } from '@/utils/pagination';

export class ListRooms {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Room>> {
    const { data, total } = await this.roomRepository.findRoomsPaginated(params, ['roomNumber', 'floor', 'isActive', 'createdAt']);
    return paginatedResponse(data, total, params);
  }
}
