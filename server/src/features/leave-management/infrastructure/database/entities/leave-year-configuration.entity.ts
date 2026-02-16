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

@Entity(LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS)
export class LeaveYearConfigurationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', comment: 'Leave year start' })
  cutoff_start_date: Date;

  @Column({ type: 'date', comment: 'Leave year end' })
  cutoff_end_date: Date;

  @Column({ type: 'varchar', length: 50, comment: 'Year label (e.g. 2025)' })
  @Index()
  year: string;

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
}
