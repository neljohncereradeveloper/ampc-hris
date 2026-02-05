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
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import { TrainingEntity } from './training.entity';

@Entity(MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES)
export class TrainingCertificateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Certificate name',
  })
  certificate_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Issuing organization',
  })
  issuing_organization: string;

  @Column({
    type: 'date',
    comment: 'Issue date',
  })
  issue_date: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Expiry date',
  })
  expiry_date: Date | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Certificate number',
  })
  certificate_number: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Certificate file path',
  })
  file_path: string | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the training certificate',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the training certificate',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the training certificate',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * RELATIONS
   */
  /**
   * One training certificate has many trainings
   */
  @OneToMany(() => TrainingEntity, (training) => training.training_certificate)
  trainings: TrainingEntity[];
}
