import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  private isCloudinaryConfigured = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isCloudinaryConfigured = true;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; publicId?: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (this.isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'kids-fashion' },
          (error, result) => {
            if (error || !result) {
              return reject(new BadRequestException('Failed to upload image to Cloudinary'));
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
          },
        );
        uploadStream.end(file.buffer);
      });
    }

    // Fallback: Mock base64 or public URL for local development
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return { url: base64 };
  }
}
