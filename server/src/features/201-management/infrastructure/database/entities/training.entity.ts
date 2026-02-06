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
import { TrainingCertificateEntity } from './training-certificate.entity';

@Entity(MANAGEMENT_201_DATABASE_MODELS.TRAININGS)
export class TrainingEntity {
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
    type: 'date',
    comment: 'Training date',
  })
  @Index()
  training_date: Date;

  @Column({
    type: 'int',
    comment: 'Training certificate ID',
  })
  @Index()
  trainings_cert_id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Training title',
  })
  training_title: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Description',
  })
  desc1: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Training image path',
  })
  image_path: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the training',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the training',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the training',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * Many trainings belong to one employee
   */
  @ManyToOne(() => EmployeeEntity, { nullable: true })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity | null;

  /**
   * Many trainings belong to one training certificate
   */
  @ManyToOne(() => TrainingCertificateEntity)
  @JoinColumn({ name: 'trainings_cert_id' })
  training_certificate: TrainingCertificateEntity;
}
