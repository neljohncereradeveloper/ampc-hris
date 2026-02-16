import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { EmployeeEntity } from '@/features/shared-domain/infrastructure/database/entities/employee.entity';
import { LeaveTypeEntity } from '@/features/shared-domain/infrastructure/database/entities/leave-type.entity';
import { LeavePolicyEntity } from './leave-policy.entity';
import { LeaveRequestEntity } from './leave-request.entity';
import { LeaveEncashmentEntity } from './leave-encashment.entity';
import { LeaveTransactionEntity } from './leave-transaction.entity';

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES)
export class LeaveBalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Employee who owns this balance' })
  @Index()
  employee_id: number;

  @Column({ type: 'int', comment: 'Leave type' })
  @Index()
  leave_type_id: number;

  @Column({ type: 'int', comment: 'Policy defining entitlement' })
  @Index()
  policy_id: number;

  @Column({ type: 'varchar', length: 50, comment: 'Leave year (e.g. 2025)' })
  @Index()
  year: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Opening balance at year start',
  })
  beginning_balance: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Days earned this year',
  })
  earned: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Days used (approved leave)',
  })
  used: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Days carried over',
  })
  carried_over: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Days encashed',
  })
  encashed: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 0,
    comment: 'Available days',
  })
  remaining: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Last transaction date',
  })
  last_transaction_date: Date | null;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Status: open, closed, reopened, finalized',
  })
  @Index()
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: 'Remarks' })
  remarks: string | null;

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

  @ManyToOne(() => LeavePolicyEntity, (policy) => policy.leave_balances)
  @JoinColumn({ name: 'policy_id' })
  policy: LeavePolicyEntity;

  @OneToMany(() => LeaveRequestEntity, (request) => request.balance)
  leave_requests: LeaveRequestEntity[];

  @OneToMany(() => LeaveEncashmentEntity, (enc) => enc.balance)
  leave_encashments: LeaveEncashmentEntity[];

  @OneToMany(() => LeaveTransactionEntity, (tx) => tx.balance)
  leave_transactions: LeaveTransactionEntity[];
}
