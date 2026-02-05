import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import { EmployeeEntity } from '@/features/shared-domain/infrastructure/database/entities/employee.entity';
import { WorkExperienceCompanyEntity } from './work-experience-company.entity';
import { WorkExperienceJobTitleEntity } from './work-experience-jobtitle.entity';

@Entity(MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES)
export class WorkExperienceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Employee ID',
  })
  @Index()
  employee_id: number | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Work experience company ID',
  })
  @Index()
  company_id: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Work experience company name (denormalized)',
  })
  company: string | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Work experience job title ID',
  })
  @Index()
  work_experience_job_title_id: number | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Work experience job title name (denormalized)',
  })
  work_experience_job_title: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: 'Years of experience',
  })
  years: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the work experience',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the work experience',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the work experience',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * Many work experiences belong to one employee
   */
  @ManyToOne(() => EmployeeEntity, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity | null;

  /**
   * Many work experiences belong to one work experience company
   */
  @ManyToOne(() => WorkExperienceCompanyEntity, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  work_experience_company: WorkExperienceCompanyEntity | null;

  /**
   * Many work experiences belong to one work experience job title
   */
  @ManyToOne(() => WorkExperienceJobTitleEntity, { nullable: true })
  @JoinColumn({ name: 'work_experience_job_title_id' })
  work_experience_job_title_entity: WorkExperienceJobTitleEntity | null;
}
