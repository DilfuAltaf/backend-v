import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Department } from '../departments/entities/department.entity';
import { Article } from '../blog/entities/article.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Article, User])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
