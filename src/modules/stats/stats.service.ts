import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { Article } from '../blog/entities/article.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const totalDepartments = await this.departmentRepository.count();
    const totalArticles = await this.articleRepository.count();
    const totalAdmins = await this.userRepository.count({
      where: [{ role: 'admin' as any }, { role: 'super_admin' as any }],
    });

    return {
      total_departments: totalDepartments,
      total_articles: totalArticles,
      total_admins: totalAdmins,
      total_visitors: Math.floor(Math.random() * 1000) + 500, // Dummy visitor count
    };
  }
}
