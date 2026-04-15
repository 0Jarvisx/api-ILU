import { IRoomRepository } from '@/domain/room/ports/IRoomRepository';
import { IStoragePort } from '@/domain/room/ports/IStoragePort';

export class DeleteRoomImage {
  constructor(
    private roomRepository: IRoomRepository,
    private storagePort: IStoragePort,
  ) {}

  async execute(roomId: number, imageId: number): Promise<void> {
    const room = await this.roomRepository.findRoomById(roomId);
    if (!room) throw new Error(`Habitación no encontrada: ${roomId}`);

    const image = await this.roomRepository.findRoomImageById(imageId);
    if (!image || image.roomId !== roomId) throw new Error(`Imagen no encontrada: ${imageId}`);

    await this.roomRepository.softDeleteRoomImage(imageId);
    await this.storagePort.delete(image.key).catch(() => {});
  }
}
