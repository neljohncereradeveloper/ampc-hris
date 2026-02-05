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

@Entity(MANAGEMENT_201_DATABASE_MODELS.REFERENCES)
export class ReferenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Employee ID',
  })
  @Index()
  employee_id: number | null;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'First name',
  })
  fname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Middle name',
  })
  mname: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Last name',
  })
  lname: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Suffix',
  })
  suffix: string | null;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: 'Cellphone number',
  })
  cellphone_number: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the reference',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the reference',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the reference',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * Many references belong to one employee
   */
  @ManyToOne(() => EmployeeEntity, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity | null;
}
