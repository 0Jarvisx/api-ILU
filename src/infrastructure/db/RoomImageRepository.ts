import prisma from '@/config/prisma';
import { RoomImage } from '@/domain/room/RoomImage';
import { SaveRoomImageData } from '@/domain/room/ports/IRoomRepository';

function toImageEntity(r: {
  id: number;
  roomId: number;
  url: string;
  key: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  deletedAt: Date | null;
}): RoomImage {
  return new RoomImage(r);
}

const IMAGE_ORDER = [
  { isPrimary: 'desc' as const },
  { sortOrder: 'asc' as const },
  { createdAt: 'asc' as const },
];

export class RoomImageRepository {
  async findImagesByRoomId(roomId: number): Promise<RoomImage[]> {
    const records = await prisma.roomImage.findMany({
      where: { roomId, deletedAt: null },
      orderBy: IMAGE_ORDER,
    });
    return records.map(toImageEntity);
  }

  async saveRoomImage(data: SaveRoomImageData): Promise<RoomImage> {
    const r = await prisma.roomImage.create({ data });
    return toImageEntity(r);
  }

  async findRoomImageById(imageId: number): Promise<RoomImage | null> {
    const r = await prisma.roomImage.findFirst({
      where: { id: imageId, deletedAt: null },
    });
    return r ? toImageEntity(r) : null;
  }

  async softDeleteRoomImage(imageId: number): Promise<void> {
    await prisma.roomImage.update({
      where: { id: imageId },
      data: { deletedAt: new Date() },
    });
  }

  async clearPrimaryForRoom(roomId: number): Promise<void> {
    await prisma.roomImage.updateMany({
      where: { roomId, isPrimary: true, deletedAt: null },
      data: { isPrimary: false },
    });
  }
}
