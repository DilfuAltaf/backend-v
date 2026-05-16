import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { School } from '../../schools/entities/school.entity';
import { Article } from '../../blog/entities/article.entity';
import { Role } from '../../auth/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  full_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.TEACHER })
  role: Role;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url: string;

  @Column({ type: 'tinyint', width: 1, default: 1 })
  is_active: boolean;

  @Column({ type: 'datetime', nullable: true })
  last_login_at: Date;

  @ManyToOne(() => School, (school) => school.users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP()', onUpdate: 'CURRENT_TIMESTAMP()' })
  updated_at: Date;
}
