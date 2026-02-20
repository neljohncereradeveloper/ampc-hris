import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

@Entity(SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS)
@Unique([SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS, 'name', 'date'])
export class HolidayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Name of the holiday. example: New Year\'s Day, Independence Day, etc.',
  })
  @Index()
  name: string;

  @Column({
    type: 'date',
    comment: 'Date of the holiday. example: January 1, 2026, July 4, 2026, etc.',
  })
  @Index()
  date: Date;

  @Column({
    type: 'varchar',
    length: 50,
    comment: 'Type of holiday. example: National, Regional, Special, etc.',
  })
  @Index()
  type: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Description of the holiday. example: New Year\'s Day is a national holiday in the Philippines.',
  })
  description: string | null;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Whether the holiday recurs annually. example: true for holidays that recur annually, false for holidays that do not recur annually.',
  })
  is_recurring: boolean;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the holiday',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the holiday',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the holiday',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;
}
