import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';

export class DeleteRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.roomRepository.findRoomById(id);
    if (!existing) throw new Error(`Habitación no encontrada: ${id}`);
    await this.roomRepository.softDeleteRoom(id);
  }
}
