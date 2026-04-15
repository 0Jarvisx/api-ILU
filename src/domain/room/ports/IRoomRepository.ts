import { Room } from '@/domain/room/Room';
import { RoomType } from '@/domain/room/RoomType';
import { RoomImage } from '@/domain/room/RoomImage';
import { PaginationParams } from '@/utils/pagination';

export interface SaveRoomImageData {
  roomId: number;
  url: string;
  key: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface CreateRoomData {
  roomNumber: string;
  roomTypeId: number;
  floor: number;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateRoomData {
  roomNumber?: string;
  roomTypeId?: number;
  floor?: number;
  isActive?: boolean;
  notes?: string;
}

export interface CreateRoomTypeData {
  name: string;
  basePricePerNight: number;
  maxCapacity: number;
  maxAdults: number;
  maxChildren?: number;
  description?: string;
}

export interface UpdateRoomTypeData {
  name?: string;
  basePricePerNight?: number;
  maxCapacity?: number;
  maxAdults?: number;
  maxChildren?: number;
  description?: string;
}

export interface SetRoomTypeAmenitiesData {
  roomTypeId: number;
  amenityIds: number[];
}

export interface AvailableRoomFilters {
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
}

export interface IRoomRepository {
  findAvailableRooms(filters: AvailableRoomFilters): Promise<Room[]>;
  // Rooms
  findRoomById(id: number): Promise<Room | null>;
  findRoomsPaginated(params: PaginationParams, allowedOrderFields: string[]): Promise<{ data: Room[]; total: number }>;
  saveRoom(data: CreateRoomData): Promise<Room>;
  updateRoom(id: number, data: UpdateRoomData): Promise<Room>;
  softDeleteRoom(id: number): Promise<void>;

  // Room Images
  findImagesByRoomId(roomId: number): Promise<RoomImage[]>;
  saveRoomImage(data: SaveRoomImageData): Promise<RoomImage>;
  findRoomImageById(imageId: number): Promise<RoomImage | null>;
  softDeleteRoomImage(imageId: number): Promise<void>;
  clearPrimaryForRoom(roomId: number): Promise<void>;

  // Room Types
  findRoomTypeById(id: number): Promise<RoomType | null>;
  findRoomTypesPaginated(params: PaginationParams, allowedOrderFields: string[]): Promise<{ data: RoomType[]; total: number }>;
  saveRoomType(data: CreateRoomTypeData): Promise<RoomType>;
  updateRoomType(id: number, data: UpdateRoomTypeData): Promise<RoomType>;
  softDeleteRoomType(id: number): Promise<void>;
  setRoomTypeAmenities(data: SetRoomTypeAmenitiesData): Promise<RoomType>;
}
