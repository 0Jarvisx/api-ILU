import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { RoomType } from '@/domain/room/RoomType';
import { PaginationParams, PaginatedResult, paginatedResponse } from '@/utils/pagination';

export class ListRoomTypes {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<RoomType>> {
    const { data, total } = await this.roomRepository.findRoomTypesPaginated(params, ['name', 'basePricePerNight', 'maxCapacity', 'createdAt']);
    return paginatedResponse(data, total, params);
  }
}
