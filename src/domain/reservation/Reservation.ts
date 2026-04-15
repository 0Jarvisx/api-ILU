import { Room } from "@prisma/client";

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';

export interface ReservationNightlyPriceData {
  id: number;
  reservationId: number;
  date: Date;
  price: number;
}

export interface ReservationProps {
  id: number;
  confirmationCode: string;
  guestId: number;
  roomId: number;
  userId?: number | null;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: number;
  status: ReservationStatus;
  notes?: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  nightlyPrices?: ReservationNightlyPriceData[];
  room?: Room;
}

export class Reservation {
  id: number;
  confirmationCode: string;
  guestId: number;
  roomId: number;
  userId: number | null;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: number;
  status: ReservationStatus;
  notes: string | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  nightlyPrices: ReservationNightlyPriceData[];
  room: Room;

  constructor(props: ReservationProps) {
    this.id = props.id;
    this.confirmationCode = props.confirmationCode;
    this.guestId = props.guestId;
    this.roomId = props.roomId;
    this.userId = props.userId ?? null;
    this.checkIn = props.checkIn;
    this.checkOut = props.checkOut;
    this.guestCount = props.guestCount;
    this.totalPrice = props.totalPrice;
    this.status = props.status;
    this.notes = props.notes ?? null;
    this.version = props.version;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.nightlyPrices = props.nightlyPrices ?? [];
    this.room = props.room || ({} as Room);
  }

  get nights(): number {
    const ms = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }
}
