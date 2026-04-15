import { WaitlistEntry } from '@/domain/waitlist/WaitlistService';

export class WaitlistRepository {
  async findAll(): Promise<WaitlistEntry[]> {
    // TODO: reemplazar con prisma.waitlist.findMany() tras la migración
    return [];
  }

  async save(entry: WaitlistEntry): Promise<WaitlistEntry> {
    // TODO: implementar persistencia
    return entry;
  }
}
