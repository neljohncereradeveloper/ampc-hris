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
    comment: 'Leave type name',
  })
  @Index()
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Short code (e.g. VL, SL)',
  })
  @Index()
  code: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Leave type description (desc1)',
  })
  @Index()
  desc1: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Whether this leave type is paid',
  })
  paid: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Optional remarks',
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
