import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';

export class DeleteRoomType {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.roomRepository.findRoomTypeById(id);
    if (!existing) throw new Error(`Tipo de habitación no encontrado: ${id}`);
    await this.roomRepository.softDeleteRoomType(id);
  }
}
