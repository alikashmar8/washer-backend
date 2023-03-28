import { Injectable } from '@nestjs/common';
import { createWriteStream, unlink } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImageFileService {
  private readonly UPLOADS_DIR = './public/uploads/products';

  async saveImage(file: Express.Multer.File): Promise<{ filename: string }> {
    const filename = `${uuid()}-${file.originalname}`;
    const path = join(this.UPLOADS_DIR, filename);

    return new Promise((resolve, reject) =>
      createWriteStream(path)
        .on('finish', () => resolve({ filename }))
        .on('error', (error) => reject(error))
        .end(file.buffer),
    );
  }

  async deleteImage(filename: string): Promise<void> {
    const path = join(this.UPLOADS_DIR, filename);

    return new Promise((resolve, reject) =>
      unlink(path, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }),
    );
  }
}
