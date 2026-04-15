//pensando en el deploy :)))
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { IStoragePort, UploadResult } from '@/domain/room/ports/IStoragePort';
import env from '@/config/env';

export class S3StorageAdapter implements IStoragePort {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.bucket = env.AWS_S3_BUCKET;
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadResult> {
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    const key = `${folder}/${filename}`;

    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const url = `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
    return { url, key };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }
}
