import multer from 'multer';
import { Request } from 'express';
import config from '@/config/app';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    if (config.upload.allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  } else if (file.mimetype.startsWith('video/')) {
    if (config.upload.allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video type. Only MP4, WebM, and QuickTime are allowed.'));
    }
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

export const uploadSingle = (fieldName: string) => upload.single(fieldName);

export const uploadMultiple = (fieldName: string, maxCount: number = 5) => 
  upload.array(fieldName, maxCount);

export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);
