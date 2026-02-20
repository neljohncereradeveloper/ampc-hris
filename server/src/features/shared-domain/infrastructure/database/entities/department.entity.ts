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
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import { EmployeeEntity } from './employee.entity';
import { DepartmentScope } from '@/features/shared-domain/domain/enum';

@Entity(SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS)
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Department description. example: Human Resources, Information Technology, etc.',
  })
  @Index()
  desc1: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Department code. example: HR, IT, FIN, etc.',
  })
  @Index()
  code: string;

  @Column({
    type: 'enum',
    enum: DepartmentScope,
    comment: 'Department scope. example: HEAD_OFFICE, BRANCH, etc.',
  })
  @Index()
  scope: DepartmentScope;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Department remarks. example: Human Resources Department, Information Technology Department, etc.',
  })
  remarks: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the department',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the department',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the department',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * One department belongs to many employees as department
   */
  @OneToMany(() => EmployeeEntity, (employee) => employee.department)
  employees: EmployeeEntity[];
}
