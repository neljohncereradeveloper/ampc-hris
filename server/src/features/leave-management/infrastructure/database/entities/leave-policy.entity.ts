import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES)
export class LeavePolicyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Leave type this policy applies to' })
  @Index()
  leave_type_id: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    comment: 'Days granted per year',
  })
  annual_entitlement: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Max days carry over',
  })
  carry_limit: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Max days encashable per year',
  })
  encash_limit: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Years from which carry over allowed',
  })
  carried_over_years: number;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Effective date',
  })
  effective_date: Date | null;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Expiry/retirement date',
  })
  expiry_date: Date | null;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Status: draft, active, inactive, retired',
  })
  @Index()
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Remarks' })
  remarks: string | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Minimum service months',
  })
  minimum_service_months: number | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Allowed employment types',
  })
  allowed_employment_types: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Allowed employee statuses',
  })
  allowed_employee_statuses: string[] | null;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Excluded weekdays (0-6)',
  })
  excluded_weekdays: number[] | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the record',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the record',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the record',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;
}
