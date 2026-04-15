export interface AmenityDTO {
  id: number;
  name: string;
  icon: string | null;
}

export interface RoomTypeProps {
  id: number;
  name: string;
  basePricePerNight: number;
  maxCapacity: number;
  maxAdults: number;
  maxChildren: number;
  description?: string | null;
  createdAt?: Date;
  deletedAt?: Date | null;
  amenities?: AmenityDTO[];
}

export class RoomType {
  id: number;
  name: string;
  basePricePerNight: number;
  maxCapacity: number;
  maxAdults: number;
  maxChildren: number;
  description: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  amenities: AmenityDTO[];

  constructor(props: RoomTypeProps) {
    this.id = props.id;
    this.name = props.name;
    this.basePricePerNight = props.basePricePerNight;
    this.maxCapacity = props.maxCapacity;
    this.maxAdults = props.maxAdults;
    this.maxChildren = props.maxChildren;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.amenities = props.amenities ?? [];
  }
}
