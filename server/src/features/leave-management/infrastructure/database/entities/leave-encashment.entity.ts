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

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS)
export class LeaveEncashmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Employee' })
  @Index()
  employee_id: number;

  @Column({ type: 'int', comment: 'Balance to debit' })
  @Index()
  balance_id: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: 'Days encashed',
  })
  total_days: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    comment: 'Amount paid',
  })
  amount: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Status: pending, paid, cancelled',
  })
  @Index()
  status: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Payroll reference (when paid)',
  })
  payroll_ref: string | null;

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
