import fs from 'fs/promises';
import path from 'path';
import { IStoragePort, UploadResult } from '@/domain/room/ports/IStoragePort';
import env from '@/config/env';

export class LocalStorageAdapter implements IStoragePort {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'uploads');
    this.baseUrl = env.APP_URL;
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const dir = path.join(this.baseDir, folder);
    await fs.mkdir(dir, { recursive: true });

    const ext = file.originalname.split('.').pop()?.toLowerCase() ?? 'jpg';
    const filename = `${Date.now()}.${ext}`;
    const dest = path.join(dir, filename);
    await fs.writeFile(dest, file.buffer);

    const key = `${folder}/${filename}`;
    const url = `${this.baseUrl}/uploads/${key}`;
    return { url, key };
  }

  async delete(key: string): Promise<void> {
    const fullPath = path.join(this.baseDir, key);
    await fs.unlink(fullPath).catch(() => {});
  }
}
