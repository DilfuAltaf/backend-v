import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  vision: string;

  @Column({ type: 'text', nullable: true })
  mission: string;

  @Column({ type: 'text', nullable: true })
  history: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  principal_name: string;

  @Column({ nullable: true })
  principal_photo: string;

  @Column({ type: 'text', nullable: true })
  principal_message: string;

  @Column({ type: 'int', default: 0 })
  student_count: number;

  @Column({ type: 'int', default: 0 })
  teacher_count: number;

  @Column({ type: 'int', default: 0 })
  department_count: number;

  @Column({ nullable: true })
  accreditation: string;

  @Column({ type: 'text', nullable: true })
  map_embed: string;

  @Column({ nullable: true })
  instagram_url: string;

  @Column({ nullable: true })
  youtube_url: string;

  @Column({ nullable: true })
  tiktok_url: string;

  @Column({ nullable: true })
  facebook_url: string;

  @OneToMany(() => User, (user) => user.school)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
