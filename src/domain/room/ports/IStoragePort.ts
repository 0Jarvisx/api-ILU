export interface UploadResult {
  url: string;
  key: string;
}

export interface IStoragePort {
  upload(file: Express.Multer.File, folder: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}
