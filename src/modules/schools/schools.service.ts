import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  async getProfile(): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: {}, // Get the first school record
    });
    if (!school) {
      // Create a default school record if none exists
      return this.schoolRepository.save(this.schoolRepository.create({ name: 'Default School Name', address: 'Default Address' }));
    }
    return school;
  }

  async updateProfile(id: string, updateDto: any): Promise<School> {
    const school = await this.schoolRepository.findOne({ where: { id } });
    if (!school) throw new NotFoundException('School not found');
    
    Object.assign(school, updateDto);
    return this.schoolRepository.save(school);
  }
}
