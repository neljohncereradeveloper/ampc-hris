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

@Entity(MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_JOBTITLES)
export class WorkExperienceJobTitleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Work experience job title description (desc1)',
  })
  @Index()
  desc1: string;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the work experience job title',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the work experience job title',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the work experience job title',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * One work experience job title has many work experiences
   */
  @OneToMany(
    () => WorkExperienceEntity,
    (work_experience) => work_experience.work_experience_job_title_entity,
  )
  work_experiences: WorkExperienceEntity[];
}
