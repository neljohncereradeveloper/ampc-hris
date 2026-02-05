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
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import {
  GenderEnum,
  PaymentTypeEnum,
  LaborClassificationEnum,
  LaborClassificationStatusEnum,
} from '@/features/shared-domain/domain/enum';
import { BranchEntity } from './branch.entity';
import { DepartmentEntity } from './department.entity';
import { JobtitleEntity } from './jobtitle.entity';
import { EmploymentTypeEntity } from '@/features/201-management/infrastructure/database/entities/employment-type.entity';
import { EmploymentStatusEntity } from '@/features/201-management/infrastructure/database/entities/employment-status.entity';
import { ReligionEntity } from '@/features/201-management/infrastructure/database/entities/religion.entity';
import { CivilStatusEntity } from '@/features/201-management/infrastructure/database/entities/civil-status.entity';
import { CitizenshipEntity } from '@/features/201-management/infrastructure/database/entities/citizenship.entity';
import { BarangayEntity } from '@/features/201-management/infrastructure/database/entities/barangay.entity';
import { CityEntity } from '@/features/201-management/infrastructure/database/entities/city.entity';
import { ProvinceEntity } from '@/features/201-management/infrastructure/database/entities/province.entity';
import { ReferenceEntity } from '@/features/201-management/infrastructure/database/entities/reference.entity';
import { TrainingEntity } from '@/features/201-management/infrastructure/database/entities/training.entity';

@Entity(SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES)
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /** Employment information */
  @Column({ type: 'int', comment: 'Job title ID' })
  @Index()
  job_title_id: number;

  @Column({ type: 'int', comment: 'Employment type ID' })
  @Index()
  employment_type_id: number;

  @Column({ type: 'int', comment: 'Employment status ID' })
  @Index()
  employment_status_id: number;

  @Column({ type: 'int', nullable: true, comment: 'Leave type ID' })
  leave_type_id: number | null;

  @Column({ type: 'int', comment: 'Branch ID' })
  @Index()
  branch_id: number;

  @Column({ type: 'int', comment: 'Department ID' })
  @Index()
  department_id: number;

  @Column({ type: 'date', comment: 'Hire date' })
  hire_date: Date;

  @Column({ type: 'date', nullable: true, comment: 'End date' })
  end_date: Date | null;

  @Column({ type: 'date', nullable: true, comment: 'Regularization date' })
  regularization_date: Date | null;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    comment: 'Employee ID number',
  })
  @Index()
  id_number: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
    comment: 'Biometric number',
  })
  @Index()
  bio_number: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Employee image path',
  })
  image_path: string | null;

  /** Personal information */
  @Column({ type: 'varchar', length: 100, comment: 'First name' })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: 'Middle name' })
  middle_name: string | null;

  @Column({ type: 'varchar', length: 100, comment: 'Last name' })
  last_name: string;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: 'Suffix' })
  suffix: string | null;

  @Column({ type: 'date', comment: 'Birth date' })
  birth_date: Date;

  @Column({ type: 'int', comment: 'Religion ID' })
  religion_id: number;

  @Column({ type: 'int', comment: 'Civil status ID' })
  civil_status_id: number;

  @Column({ type: 'int', nullable: true, comment: 'Age' })
  age: number | null;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
    comment: 'Gender',
  })
  gender: GenderEnum | null;

  @Column({ type: 'int', comment: 'Citizenship ID' })
  citizen_ship_id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: 'Height' })
  height: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, comment: 'Weight' })
  weight: number | null;

  /** Address information */
  @Column({ type: 'varchar', length: 255, comment: 'Home address street' })
  home_address_street: string;

  @Column({ type: 'int', comment: 'Home address barangay ID' })
  home_address_barangay_id: number;

  @Column({ type: 'int', comment: 'Home address city ID' })
  home_address_city_id: number;

  @Column({ type: 'int', comment: 'Home address province ID' })
  home_address_province_id: number;

  @Column({ type: 'varchar', length: 10, comment: 'Home address zip code' })
  home_address_zip_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Present address street' })
  present_address_street: string | null;

  @Column({ type: 'int', nullable: true, comment: 'Present address barangay ID' })
  present_address_barangay_id: number | null;

  @Column({ type: 'int', nullable: true, comment: 'Present address city ID' })
  present_address_city_id: number | null;

  @Column({ type: 'int', nullable: true, comment: 'Present address province ID' })
  present_address_province_id: number | null;

  @Column({ type: 'varchar', length: 10, nullable: true, comment: 'Present address zip code' })
  present_address_zip_code: string | null;

  /** Contact information */
  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Cellphone number' })
  cellphone_number: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Telephone number' })
  telephone_number: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Email address' })
  email: string | null;

  /** Emergency contact information */
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Emergency contact name' })
  emergency_contact_name: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: 'Emergency contact number' })
  emergency_contact_number: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true, comment: 'Emergency contact relationship' })
  emergency_contact_relationship: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Emergency contact address' })
  emergency_contact_address: string | null;

  /** Family information */
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Husband or wife name' })
  husband_or_wife_name: string | null;

  @Column({ type: 'date', nullable: true, comment: 'Husband or wife birth date' })
  husband_or_wife_birth_date: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Husband or wife occupation' })
  husband_or_wife_occupation: string | null;

  @Column({ type: 'int', nullable: true, comment: 'Number of children' })
  number_of_children: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Fathers name' })
  fathers_name: string | null;

  @Column({ type: 'date', nullable: true, comment: 'Fathers birth date' })
  fathers_birth_date: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Fathers occupation' })
  fathers_occupation: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Mothers name' })
  mothers_name: string | null;

  @Column({ type: 'date', nullable: true, comment: 'Mothers birth date' })
  mothers_birth_date: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Mothers occupation' })
  mothers_occupation: string | null;

  /** Bank account information */
  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Bank account number' })
  bank_account_number: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Bank account name' })
  bank_account_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Bank name' })
  bank_name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Bank branch' })
  bank_branch: string | null;

  /** Salary information */
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, comment: 'Annual salary' })
  annual_salary: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, comment: 'Monthly salary' })
  monthly_salary: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, comment: 'Daily rate' })
  daily_rate: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, comment: 'Hourly rate' })
  hourly_rate: number | null;

  @Column({
    type: 'enum',
    enum: PaymentTypeEnum,
    nullable: true,
    comment: 'Payment type',
  })
  pay_type: PaymentTypeEnum | null;

  /** Government information */
  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'PHIC number' })
  phic: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'HDMF number' })
  hdmf: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'SSS number' })
  sss_no: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'TIN number' })
  tin_no: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Tax exempt code' })
  tax_exempt_code: string | null;

  /** Active status */
  @Column({ type: 'boolean', default: true, comment: 'Is active' })
  is_active: boolean;

  /** Labor classification */
  @Column({
    type: 'enum',
    enum: LaborClassificationEnum,
    nullable: true,
    comment: 'Labor classification',
  })
  labor_classification: LaborClassificationEnum | null;

  @Column({
    type: 'enum',
    enum: LaborClassificationStatusEnum,
    nullable: true,
    comment: 'Labor classification status',
  })
  labor_classification_status: LaborClassificationStatusEnum | null;

  /** Additional fields */
  @Column({ type: 'text', nullable: true, comment: 'Remarks' })
  remarks: string | null;

  /** Retention policy fields */
  @Column({ type: 'date', nullable: true, comment: 'Last entry date' })
  last_entry_date: Date | null;

  @Column({ type: 'date', nullable: true, comment: 'Retention expiry date' })
  retention_expiry_date: Date | null;

  // Audit fields (in standard order)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who deleted the employee',
  })
  deleted_by: string | null;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deleted_at: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who created the employee',
  })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'User who last updated the employee',
  })
  updated_by: string | null;

  @UpdateDateColumn()
  updated_at: Date;

  /** Relationships */
  @ManyToOne(() => JobtitleEntity)
  @JoinColumn({ name: 'job_title_id' })
  job_title: JobtitleEntity;

  @ManyToOne(() => EmploymentTypeEntity)
  @JoinColumn({ name: 'employment_type_id' })
  employment_type: EmploymentTypeEntity;

  @ManyToOne(() => EmploymentStatusEntity)
  @JoinColumn({ name: 'employment_status_id' })
  employment_status: EmploymentStatusEntity;

  @ManyToOne(() => BranchEntity)
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @ManyToOne(() => DepartmentEntity)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity;

  @ManyToOne(() => ReligionEntity)
  @JoinColumn({ name: 'religion_id' })
  religion: ReligionEntity;

  @ManyToOne(() => CivilStatusEntity)
  @JoinColumn({ name: 'civil_status_id' })
  civil_status: CivilStatusEntity;

  @ManyToOne(() => CitizenshipEntity)
  @JoinColumn({ name: 'citizen_ship_id' })
  citizen_ship: CitizenshipEntity;

  @ManyToOne(() => BarangayEntity)
  @JoinColumn({ name: 'home_address_barangay_id' })
  home_address_barangay: BarangayEntity;

  @ManyToOne(() => CityEntity)
  @JoinColumn({ name: 'home_address_city_id' })
  home_address_city: CityEntity;

  @ManyToOne(() => ProvinceEntity)
  @JoinColumn({ name: 'home_address_province_id' })
  home_address_province: ProvinceEntity;

  @ManyToOne(() => BarangayEntity, { nullable: true })
  @JoinColumn({ name: 'present_address_barangay_id' })
  present_address_barangay: BarangayEntity | null;

  @ManyToOne(() => CityEntity, { nullable: true })
  @JoinColumn({ name: 'present_address_city_id' })
  present_address_city: CityEntity | null;

  @ManyToOne(() => ProvinceEntity, { nullable: true })
  @JoinColumn({ name: 'present_address_province_id' })
  present_address_province: ProvinceEntity | null;

  /**
   * One employee has many references
   */
  @OneToMany(() => ReferenceEntity, (reference) => reference.employee)
  references: ReferenceEntity[];

  /**
   * One employee has many trainings
   */
  @OneToMany(() => TrainingEntity, (training) => training.employee)
  trainings: TrainingEntity[];
}
