export interface RoomImageProps {
  id: number;
  roomId: number;
  url: string;
  key: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class RoomImage {
  id: number;
  roomId: number;
  url: string;
  key: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  deletedAt: Date | null;

  constructor(props: RoomImageProps) {
    this.id = props.id;
    this.roomId = props.roomId;
    this.url = props.url;
    this.key = props.key;
    this.isPrimary = props.isPrimary;
    this.sortOrder = props.sortOrder;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
