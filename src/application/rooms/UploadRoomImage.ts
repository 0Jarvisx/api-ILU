import { IRoomRepository, SaveRoomImageData } from '@/domain/room/ports/IRoomRepository';
import { IStoragePort } from '@/domain/room/ports/IStoragePort';
import { RoomImage } from '@/domain/room/RoomImage';

export class UploadRoomImage {
  constructor(
    private roomRepository: IRoomRepository,
    private storagePort: IStoragePort,
  ) {}

  async execute(
    roomId: number,
    file: Express.Multer.File,
    options: { isPrimary?: boolean; sortOrder?: number } = {},
  ): Promise<RoomImage> {
    const room = await this.roomRepository.findRoomById(roomId);
    if (!room) throw new Error(`Habitación no encontrada: ${roomId}`);

    const isPrimary = options.isPrimary ?? false;

    if (isPrimary) {
      await this.roomRepository.clearPrimaryForRoom(roomId);
    }

    const { url, key } = await this.storagePort.upload(file, 'rooms');

    const existing = await this.roomRepository.findImagesByRoomId(roomId);
    const sortOrder = options.sortOrder ?? existing.length;

    const data: SaveRoomImageData = { roomId, url, key, isPrimary, sortOrder };
    return this.roomRepository.saveRoomImage(data);
  }
}
