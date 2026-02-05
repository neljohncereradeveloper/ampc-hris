import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';

@Entity(MANAGEMENT_201_DATABASE_MODELS.EDUCATION_LEVELS)
export class EducationLevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Education level description (desc1)',
  })
  @Index()
  desc1: string;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the education level',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the education level',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the education level',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;
}
