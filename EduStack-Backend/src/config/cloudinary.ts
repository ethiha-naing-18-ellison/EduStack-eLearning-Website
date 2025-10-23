import { v2 as cloudinary } from 'cloudinary';
import config from './app';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export default cloudinary;

export const uploadImage = async (file: Buffer, folder: string = 'edustack') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'fill', quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file);
  });
};

export const uploadVideo = async (file: Buffer, folder: string = 'edustack/videos') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',
        transformation: [
          { width: 1280, height: 720, crop: 'fill', quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file);
  });
};

export const deleteFile = async (publicId: string) => {
  return cloudinary.uploader.destroy(publicId);
};
