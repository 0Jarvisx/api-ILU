import { Guest } from '@/domain/guest/Guest';

export interface CreateGuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
}

export interface IGuestRepository {
  findByEmail(email: string): Promise<Guest | null>;
  findById(id: number): Promise<Guest | null>;
  upsertByEmail(data: CreateGuestData): Promise<Guest>;
}
