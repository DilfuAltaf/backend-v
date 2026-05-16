import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll() {
    return this.departmentRepository.find();
  }

  async findOne(id: string) {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async create(createDto: any) {
    const department = this.departmentRepository.create(createDto);
    return this.departmentRepository.save(department);
  }

  async update(id: string, updateDto: any) {
    const department = await this.findOne(id);
    Object.assign(department, updateDto);
    return this.departmentRepository.save(department);
  }

  async remove(id: string) {
    const department = await this.findOne(id);
    return this.departmentRepository.remove(department);
  }
}
