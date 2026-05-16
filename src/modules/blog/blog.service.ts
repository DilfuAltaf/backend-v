import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Not } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { Category } from './entities/category.entity';
import { createSlug } from '../../utils/slug.util';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // --- Category Methods ---

  async findAllCategories() {
    return this.categoryRepository.find();
  }

  async createCategory(dto: any) {
    const slug = dto.slug || createSlug(dto.name);
    const category = this.categoryRepository.create({ ...dto, slug });
    return this.categoryRepository.save(category);
  }

  // --- Article Methods ---

  async findAllArticles(options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: ArticleStatus;
    is_featured?: boolean;
    sort?: 'latest' | 'popular';
  }) {
    const { page = 1, limit = 10, search, category, status, is_featured, sort } = options;
    const skip = (page - 1) * limit;

    const query = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.author', 'author');

    if (search) {
      query.andWhere('(article.title LIKE :search OR article.content LIKE :search)', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('category.slug = :category', { category });
    }

    if (status) {
      query.andWhere('article.status = :status', { status });
    }

    if (is_featured !== undefined) {
      query.andWhere('article.is_featured = :is_featured', { is_featured });
    }

    if (sort === 'popular') {
      query.orderBy('article.views', 'DESC');
    } else {
      query.orderBy('article.created_at', 'DESC');
    }

    const [items, total] = await query
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  async findOneBySlug(slug: string) {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['category', 'author'],
    });

    if (!article) throw new NotFoundException('Article not found');

    // Increment views
    article.views += 1;
    await this.articleRepository.save(article);

    return article;
  }

  async findRelated(articleId: string, limit: number = 3) {
    const article = await this.articleRepository.findOne({ where: { id: articleId }, relations: ['category'] });
    if (!article || !article.category) return [];

    return this.articleRepository.find({
      where: {
        category: { id: article.category.id },
        id: Not(articleId),
        status: ArticleStatus.PUBLISHED,
      },
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async createArticle(dto: any, authorId: number) {
    const slug = dto.slug || createSlug(dto.title);
    
    // Check if slug exists
    const existing = await this.articleRepository.findOne({ where: { slug } });
    if (existing) throw new BadRequestException('Slug already exists');

    const article = this.articleRepository.create({
      ...dto,
      slug,
      author: { id: authorId },
    } as Article);

    if (dto.status === ArticleStatus.PUBLISHED && !dto.published_at) {
      article.published_at = new Date();
    }

    return this.articleRepository.save(article);
  }

  async updateArticle(id: string, dto: any) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    if (dto.title && !dto.slug) {
      dto.slug = createSlug(dto.title);
    }

    Object.assign(article, dto);
    
    if (dto.status === ArticleStatus.PUBLISHED && !article.published_at) {
      article.published_at = new Date();
    }

    return this.articleRepository.save(article);
  }

  async removeArticle(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return this.articleRepository.remove(article);
  }

  async getStats() {
    const total = await this.articleRepository.count();
    const published = await this.articleRepository.count({ where: { status: ArticleStatus.PUBLISHED } });
    const featured = await this.articleRepository.count({ where: { is_featured: true } });
    const totalViews = await this.articleRepository.sum('views', {});

    return {
      total_articles: total,
      published_articles: published,
      featured_articles: featured,
      total_views: totalViews || 0,
    };
  }
}
