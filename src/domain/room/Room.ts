import { RoomImage } from '@/domain/room/RoomImage';

export interface RoomTypeRef {
  id: number;
  name: string;
  basePricePerNight?: number;
  maxCapacity?: number;
  maxAdults?: number;
  maxChildren?: number;
  description?: string | null;
  amenities?: { id: number; name: string; icon?: string | null }[];
}

export interface RoomProps {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  floor: number;
  isActive: boolean;
  notes?: string | null;
  createdAt?: Date;
  deletedAt?: Date | null;
  roomType?: RoomTypeRef;
  images?: RoomImage[];
}

export class Room {
  id: number;
  roomNumber: string;
  roomTypeId: number;
  floor: number;
  isActive: boolean;
  notes: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  roomType?: RoomTypeRef;
  images?: RoomImage[];

  constructor(props: RoomProps) {
    this.id = props.id;
    this.roomNumber = props.roomNumber;
    this.roomTypeId = props.roomTypeId;
    this.floor = props.floor;
    this.isActive = props.isActive;
    this.notes = props.notes ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.roomType = props.roomType;
    this.images = props.images;
  }
}
