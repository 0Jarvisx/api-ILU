import { IStoragePort } from '@/domain/room/ports/IStoragePort';
import { LocalStorageAdapter } from '@/infrastructure/storage/LocalStorageAdapter';
import { S3StorageAdapter } from '@/infrastructure/storage/S3StorageAdapter';
import env from '@/config/env';

function createStorageAdapter(): IStoragePort {
  if (env.STORAGE_DRIVER === 's3') {
    return new S3StorageAdapter();
  }
  return new LocalStorageAdapter();
}

export const storageAdapter: IStoragePort = createStorageAdapter();
