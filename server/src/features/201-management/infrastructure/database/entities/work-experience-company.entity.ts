import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import { WorkExperienceEntity } from './work-experience.entity';

@Entity(MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES)
export class WorkExperienceCompanyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Work experience company description (desc1)',
  })
  @Index()
  desc1: string;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the work experience company',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the work experience company',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the work experience company',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * One work experience company has many work experiences
   */
  @OneToMany(
    () => WorkExperienceEntity,
    (work_experience) => work_experience.work_experience_company,
  )
  work_experiences: WorkExperienceEntity[];
}
