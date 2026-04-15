export interface WaitlistEntry {
  id: string;
  position: number;
  [key: string]: unknown;
}

export class WaitlistService {
  getNextCandidate(waitlistEntries: WaitlistEntry[]): WaitlistEntry | null {
    if (!waitlistEntries || waitlistEntries.length === 0) return null;
    return waitlistEntries[0];
  }
}
