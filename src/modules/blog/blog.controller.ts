import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ArticleStatus } from './entities/article.entity';

@ApiTags('Blog / Articles')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // --- Public Endpoints ---

  @ApiOperation({ summary: 'Get all published articles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Category slug' })
  @ApiQuery({ name: 'sort', required: false, enum: ['latest', 'popular'] })
  @ApiQuery({ name: 'is_featured', required: false, type: Boolean })
  @Get('articles')
  findAllPublic(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: 'latest' | 'popular',
    @Query('is_featured') is_featured?: string,
  ) {
    return this.blogService.findAllArticles({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      search,
      category,
      sort,
      is_featured: is_featured === 'true',
      status: ArticleStatus.PUBLISHED,
    });
  }

  @ApiOperation({ summary: 'Get article by slug' })
  @Get('articles/:slug')
  findOne(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @ApiOperation({ summary: 'Get related articles' })
  @Get('articles/:id/related')
  findRelated(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.blogService.findRelated(id, limit ? +limit : 3);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @Get('categories')
  findAllCategories() {
    return this.blogService.findAllCategories();
  }

  // --- Admin Endpoints ---

  @ApiOperation({ summary: 'Get all articles (Admin/Teacher)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER)
  @Get('admin/articles')
  findAllAdmin(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: ArticleStatus,
  ) {
    return this.blogService.findAllArticles({
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      search,
      status,
    });
  }

  @ApiOperation({ summary: 'Get blog statistics' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER)
  @Get('admin/stats')
  getStats() {
    return this.blogService.getStats();
  }

  @ApiOperation({ summary: 'Create article (Admin/Teacher)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.TEACHER)
  @Post('admin/articles')
  createArticle(@Body() dto: any, @Request() req) {
    return this.blogService.createArticle(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Update article (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch('admin/articles/:id')
  updateArticle(@Param('id') id: string, @Body() dto: any) {
    return this.blogService.updateArticle(id, dto);
  }

  @ApiOperation({ summary: 'Delete article (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete('admin/articles/:id')
  removeArticle(@Param('id') id: string) {
    return this.blogService.removeArticle(id);
  }

  @ApiOperation({ summary: 'Create category (Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('admin/categories')
  createCategory(@Body() dto: any) {
    return this.blogService.createCategory(dto);
  }
}
