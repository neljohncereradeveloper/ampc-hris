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
import { EducationSchoolEntity } from './education-school.entity';
import { EducationLevelEntity } from './education-level.entity';
import { EducationCourseEntity } from './education-course.entity';
import { EducationCourseLevelEntity } from './education-course-level.entity';

@Entity(MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS)
@Index(['employee_id'])
export class EducationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    comment: 'Employee ID',
  })
  @Index()
  employee_id: number;

  @Column({
    type: 'int',
    comment: 'Education school ID',
  })
  @Index()
  education_school_id: number;

  @Column({
    type: 'int',
    comment: 'Education level ID',
  })
  @Index()
  education_level_id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Education course ID',
  })
  @Index()
  education_course_id: number | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Education course level ID',
  })
  @Index()
  education_course_level_id: number | null;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'School year',
  })
  school_year: string;

  // Audit fields
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the education',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the education',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the education',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => EmployeeEntity, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity | null;

  @ManyToOne(() => EducationSchoolEntity, { nullable: true })
  @JoinColumn({ name: 'education_school_id' })
  education_school_entity: EducationSchoolEntity | null;

  @ManyToOne(() => EducationLevelEntity, { nullable: true })
  @JoinColumn({ name: 'education_level_id' })
  education_level_entity: EducationLevelEntity | null;

  @ManyToOne(() => EducationCourseEntity, { nullable: true })
  @JoinColumn({ name: 'education_course_id' })
  education_course_entity: EducationCourseEntity | null;

  @ManyToOne(() => EducationCourseLevelEntity, { nullable: true })
  @JoinColumn({ name: 'education_course_level_id' })
  education_course_level_entity: EducationCourseLevelEntity | null;
}
