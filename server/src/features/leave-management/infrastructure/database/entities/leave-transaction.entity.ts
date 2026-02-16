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

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_TRANSACTIONS)
export class LeaveTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: 'Balance affected' })
  @Index()
  balance_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Type: request, encashment, adjustment, carry',
  })
  @Index()
  transaction_type: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    comment: 'Days (signed)',
  })
  days: number;

  @Column({ type: 'varchar', length: 500, comment: 'Remarks' })
  remarks: string;

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
