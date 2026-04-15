import { IRoomRepository, CreateRoomData, UpdateRoomData, CreateRoomTypeData, UpdateRoomTypeData, SaveRoomImageData, SetRoomTypeAmenitiesData, AvailableRoomFilters } from '@/domain/room/ports/IRoomRepository';
import { Room } from '@/domain/room/Room';
import { RoomType } from '@/domain/room/RoomType';
import { RoomImage } from '@/domain/room/RoomImage';
import { PaginationParams } from '@/utils/pagination';
import prisma from '@/config/prisma';

const IMAGE_ORDER = [
  { isPrimary: 'desc' as const },
  { sortOrder: 'asc' as const },
  { createdAt: 'asc' as const },
];

const AMENITIES_INCLUDE = {
  amenities: {
    include: { amenity: { select: { id: true, name: true, icon: true } } },
  },
} as const;

function toRoomTypeEntity(r: any): RoomType {
  return new RoomType({
    ...r,
    basePricePerNight: Number(r.basePricePerNight),
    amenities: r.amenities?.map((a: any) => a.amenity) ?? [],
  });
}

function toRoomEntity(r: any): Room {
  const roomType = r.roomType
    ? {
        ...r.roomType,
        basePricePerNight: r.roomType.basePricePerNight !== undefined ? Number(r.roomType.basePricePerNight) : undefined,
        amenities: r.roomType.amenities?.map((a: any) => a.amenity) ?? undefined,
      }
    : undefined;
  return new Room({
    ...r,
    roomType,
    images: r.images?.map((img: any) => new RoomImage(img)),
  });
}

function toImageEntity(r: any): RoomImage {
  return new RoomImage(r);
}

export class RoomRepository implements IRoomRepository {
  // ─── Available Rooms ──────────────────────────────────────────────────────

  async findAvailableRooms({ checkIn, checkOut, guestCount }: AvailableRoomFilters): Promise<Room[]> {
    const records = await prisma.room.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        roomType: { maxCapacity: { gte: guestCount } },
        reservations: {
          none: {
            status: { not: 'CANCELLED' },
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn },
          },
        },
      },
      include: {
        roomType: {
          include: {
            amenities: { include: { amenity: { select: { id: true, name: true, icon: true } } } },
          },
        },
        images: {
          where: { deletedAt: null },
          orderBy: IMAGE_ORDER,
          select: { id: true, roomId: true, url: true, key: true, isPrimary: true, sortOrder: true, createdAt: true, deletedAt: true },
        },
      },
      orderBy: [{ floor: 'asc' }, { roomNumber: 'asc' }],
    });
    return records.map(toRoomEntity);
  }

  // ─── Rooms ────────────────────────────────────────────────────────────────

  async findRoomById(id: number): Promise<Room | null> {
    const r = await prisma.room.findFirst({
      where: { id, deletedAt: null },
      include: {
        roomType: { select: { id: true, name: true, basePricePerNight: true } },
        images: {
          where: { deletedAt: null },
          orderBy: IMAGE_ORDER,
          select: { id: true, roomId: true, url: true, key: true, isPrimary: true, sortOrder: true, createdAt: true, deletedAt: true },
        },
      },
    });
    return r ? toRoomEntity(r) : null;
  }

  async findRoomsPaginated(
    params: PaginationParams,
    allowedOrderFields: string[],
  ): Promise<{ data: Room[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'roomNumber';
    const where = { deletedAt: null };

    const [records, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
        include: { roomType: { select: { id: true, name: true } } },
      }),
      prisma.room.count({ where }),
    ]);

    return { data: records.map(toRoomEntity), total };
  }

  async saveRoom(data: CreateRoomData): Promise<Room> {
    const r = await prisma.room.create({
      data,
      include: { roomType: { select: { id: true, name: true } } },
    });
    return toRoomEntity(r);
  }

  async updateRoom(id: number, data: UpdateRoomData): Promise<Room> {
    const r = await prisma.room.update({
      where: { id },
      data,
      include: { roomType: { select: { id: true, name: true } } },
    });
    return toRoomEntity(r);
  }

  async softDeleteRoom(id: number): Promise<void> {
    await prisma.room.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ─── Room Images ──────────────────────────────────────────────────────────

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
    const r = await prisma.roomImage.findFirst({ where: { id: imageId, deletedAt: null } });
    return r ? toImageEntity(r) : null;
  }

  async softDeleteRoomImage(imageId: number): Promise<void> {
    await prisma.roomImage.update({ where: { id: imageId }, data: { deletedAt: new Date() } });
  }

  async clearPrimaryForRoom(roomId: number): Promise<void> {
    await prisma.roomImage.updateMany({
      where: { roomId, isPrimary: true, deletedAt: null },
      data: { isPrimary: false },
    });
  }

  // ─── Room Types ───────────────────────────────────────────────────────────

  async findRoomTypeById(id: number): Promise<RoomType | null> {
    const r = await prisma.roomType.findFirst({
      where: { id, deletedAt: null },
      include: AMENITIES_INCLUDE,
    });
    return r ? toRoomTypeEntity(r) : null;
  }

  async findRoomTypesPaginated(
    params: PaginationParams,
    allowedOrderFields: string[],
  ): Promise<{ data: RoomType[]; total: number }> {
    const orderBy = allowedOrderFields.includes(params.orderBy) ? params.orderBy : 'name';
    const where = { deletedAt: null };

    const [records, total] = await Promise.all([
      prisma.roomType.findMany({
        where,
        skip: (params.page - 1) * params.perPage,
        take: params.perPage,
        orderBy: { [orderBy]: params.order },
        include: AMENITIES_INCLUDE,
      }),
      prisma.roomType.count({ where }),
    ]);

    return { data: records.map(toRoomTypeEntity), total };
  }

  async saveRoomType(data: CreateRoomTypeData): Promise<RoomType> {
    const r = await prisma.roomType.create({
      data,
      include: AMENITIES_INCLUDE,
    });
    return toRoomTypeEntity(r);
  }

  async updateRoomType(id: number, data: UpdateRoomTypeData): Promise<RoomType> {
    const r = await prisma.roomType.update({
      where: { id },
      data,
      include: AMENITIES_INCLUDE,
    });
    return toRoomTypeEntity(r);
  }

  async softDeleteRoomType(id: number): Promise<void> {
    await prisma.roomType.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async setRoomTypeAmenities({ roomTypeId, amenityIds }: SetRoomTypeAmenitiesData): Promise<RoomType> {
    await prisma.$transaction([
      prisma.roomTypeAmenity.deleteMany({ where: { roomTypeId } }),
      prisma.roomTypeAmenity.createMany({
        data: amenityIds.map(amenityId => ({ roomTypeId, amenityId })),
        skipDuplicates: true,
      }),
    ]);

    const r = await prisma.roomType.findUniqueOrThrow({
      where: { id: roomTypeId },
      include: AMENITIES_INCLUDE,
    });
    return toRoomTypeEntity(r);
  }
}
