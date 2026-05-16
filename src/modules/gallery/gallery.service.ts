import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gallery } from './entities/gallery.entity';

@Injectable()
export class GalleryService {
  constructor(@InjectRepository(Gallery) private galleryRepository: Repository<Gallery>) {}
  findAll() { return this.galleryRepository.find(); }
  create(createDto: any) { return this.galleryRepository.save(this.galleryRepository.create(createDto)); }
  remove(id: string) { return this.galleryRepository.delete(id); }
}
