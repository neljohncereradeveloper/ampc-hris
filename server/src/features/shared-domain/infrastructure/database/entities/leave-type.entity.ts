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

@Entity(SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES)
export class LeaveTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Leave type name. example: Vacation Leave, Sick Leave, etc.',
  })
  @Index()
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Short code. example: VL, SL, etc.',
  })
  @Index()
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Leave type description. example: Vacation Leave, Sick Leave, etc.',
  })
  @Index()
  desc1: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Whether this leave type is paid. example: true for paid leave types, false for unpaid leave types',
  })
  paid: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Optional remarks. example: 5 days for employees with at least 1 year service (art. 95, labor code), 105 days (ra 11210); extendible unpaid, 7 days (ra 8187) for legitimate child, 7 days per year (ra 8972), Typically 3–5 days for immediate family, leave without pay',
  })
  remarks: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the leave type',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the leave type',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the leave type',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * One leave type belongs to many employees
   */
  @OneToMany(() => EmployeeEntity, (employee) => employee.leave_type)
  employees: EmployeeEntity[];
}
