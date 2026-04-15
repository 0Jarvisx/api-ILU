import multer from 'multer';
import { RequestHandler } from 'express';

const FIVE_MB = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FIVE_MB },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Use JPEG, PNG o WebP.'));
    }
  },
});

export const uploadSingle: RequestHandler = multerInstance.single('image');
