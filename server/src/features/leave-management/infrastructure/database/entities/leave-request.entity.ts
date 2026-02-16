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
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { EmployeeEntity } from '@/features/shared-domain/infrastructure/database/entities/employee.entity';
import { LeaveTypeEntity } from '@/features/shared-domain/infrastructure/database/entities/leave-type.entity';
import { LeaveBalanceEntity } from './leave-balance.entity';

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS)
export class LeaveRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Employee requesting leave' })
  @Index()
  employee_id: number;

  @Column({ type: 'int', comment: 'Leave type (e.g. VL, SL)' })
  @Index()
  leave_type_id: number;

  @Column({ type: 'date', comment: 'First day of leave period' })
  start_date: Date;

  @Column({ type: 'date', comment: 'Last day of leave period' })
  end_date: Date;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    comment: 'Number of leave days',
  })
  total_days: number;

  @Column({ type: 'varchar', length: 500, comment: 'Reason for leave' })
  reason: string;

  @Column({ type: 'int', comment: 'Leave balance to debit' })
  @Index()
  balance_id: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'When approved/rejected',
  })
  approval_date: Date | null;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'User who approved/rejected',
  })
  approval_by: number | null;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Remarks' })
  remarks: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Status: pending, approved, rejected, cancelled',
  })
  @Index()
  status: string;

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

  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => LeaveTypeEntity)
  @JoinColumn({ name: 'leave_type_id' })
  leave_type: LeaveTypeEntity;

  @ManyToOne(() => LeaveBalanceEntity, (balance) => balance.leave_requests)
  @JoinColumn({ name: 'balance_id' })
  balance: LeaveBalanceEntity;
}
