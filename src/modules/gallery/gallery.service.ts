import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './entities/gallery.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GalleryService {
  constructor(@InjectRepository(Gallery) private galleryRepository: Repository<Gallery>) {}
  findAll() { return this.galleryRepository.find(); }
  create(createDto: any) { return this.galleryRepository.save(this.galleryRepository.create(createDto)); }
  
  async remove(id: string) {
    const item = await this.galleryRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Gallery item not found');
    
    await this.galleryRepository.delete(id);
    
    if (item.image_url) {
      // Remove leading slash to prevent path.join from treating it as root on Windows
      const relativePath = item.image_url.startsWith('/') ? item.image_url.slice(1) : item.image_url;
      const filePath = path.join(process.cwd(), relativePath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    }
  }
}
