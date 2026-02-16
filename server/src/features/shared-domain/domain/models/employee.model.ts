import { HTTP_STATUS } from '@/core/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';
import { EmployeeBusinessException } from '../exceptions/employee-business.exception';
import {
  GenderEnum,
  PaymentTypeEnum,
  LaborClassificationEnum,
  LaborClassificationStatusEnum,
} from '../enum';

export class Employee {
  id?: number;
  /** employment information */
  job_title_id: number;
  job_title?: string;
  employment_type_id: number;
  employment_type?: string;
  employment_status_id: number;
  employment_status?: string;
  leave_type_id?: number;
  leave_type?: string;
  branch_id: number;
  branch?: string;
  department_id: number;
  department?: string;
  hire_date: Date;
  end_date?: Date;
  regularization_date?: Date;
  id_number: string;
  bio_number?: string;
  image_path?: string;
  /** personal information */
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  birth_date: Date;
  religion_id: number;
  religion?: string;
  civil_status_id: number;
  civil_status?: string;
  age?: number;
  gender?: GenderEnum;
  citizen_ship_id: number;
  citizen_ship?: string;
  height?: number;
  weight?: number;
  /**address */
  home_address_street: string;
  home_address_barangay_id: number;
  home_address_barangay?: string;
  home_address_city_id: number;
  home_address_city?: string;
  home_address_province_id: number;
  home_address_province?: string;
  home_address_zip_code: string;
  present_address_street?: string;
  present_address_barangay_id?: number;
  present_address_barangay?: string;
  present_address_city_id?: number;
  present_address_city?: string;
  present_address_province_id?: number;
  present_address_zip_code?: string;
  /** contact information */
  cellphone_number?: string;
  telephone_number?: string;
  email?: string;
  /** emergency contact information */
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;
  emergency_contact_address?: string;
  /** family information */
  husband_or_wife_name?: string;
  husband_or_wife_birth_date?: Date;
  husband_or_wife_occupation?: string;
  number_of_children?: number;
  fathers_name?: string;
  fathers_birth_date?: Date;
  fathers_occupation?: string;
  mothers_name?: string;
  mothers_birth_date?: Date;
  mothers_occupation?: string;
  /** bank account information */
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  bank_branch?: string;
  /** salary information */
  annual_salary?: number;
  monthly_salary?: number;
  daily_rate?: number;
  hourly_rate?: number;
  // pay type of the employee
  pay_type?: PaymentTypeEnum;
  /** government information */
  phic?: string;
  hdmf?: string;
  sss_no?: string;
  tin_no?: string;
  tax_exempt_code?: string;
  /** active status of the employee - temporary deactivation (e.g., on leave, suspended) */
  is_active: boolean;
  /** labor classification */
  labor_classification?: LaborClassificationEnum;
  labor_classification_status?: LaborClassificationStatusEnum;
  // Additional fields
  remarks?: string;

  /** retention policy fields (DOLE compliance - 3 years minimum) */
  last_entry_date?: Date; // Date of last activity/update in the record
  retention_expiry_date?: Date; // last_entry_date + 3 years (DOLE requirement)

  /** audit information */
  deleted_by: string | null;
  deleted_at: Date | null;
  created_by: string | null;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date;

  constructor(dto: {
    id?: number;
    /** employment information */
    job_title_id: number;
    job_title?: string;
    employment_type_id: number;
    employment_type?: string;
    employment_status_id: number;
    employment_status?: string;
    leave_type_id?: number;
    leave_type?: string;
    branch_id: number;
    branch?: string;
    department_id: number;
    department?: string;
    hire_date: Date;
    end_date?: Date;
    regularization_date?: Date;
    id_number: string;
    bio_number?: string;
    image_path?: string;
    /** personal information */
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    birth_date: Date;
    religion_id: number;
    religion?: string;
    civil_status_id: number;
    civil_status?: string;
    age?: number;
    gender?: GenderEnum;
    citizen_ship_id: number;
    citizen_ship?: string;
    height?: number;
    weight?: number;
    /**address */
    home_address_street: string;
    home_address_barangay_id: number;
    home_address_barangay?: string;
    home_address_city_id: number;
    home_address_city?: string;
    home_address_province_id: number;
    home_address_province?: string;
    home_address_zip_code: string;
    present_address_street?: string;
    present_address_barangay_id?: number;
    present_address_barangay?: string;
    present_address_city_id?: number;
    present_address_city?: string;
    present_address_province_id?: number;
    present_address_zip_code?: string;
    /** contact information */
    cellphone_number?: string;
    telephone_number?: string;
    email?: string;
    /** emergency contact information */
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    emergency_contact_address?: string;
    /** family information */
    husband_or_wife_name?: string;
    husband_or_wife_birth_date?: Date;
    husband_or_wife_occupation?: string;
    number_of_children?: number;
    fathers_name?: string;
    fathers_birth_date?: Date;
    fathers_occupation?: string;
    mothers_name?: string;
    mothers_birth_date?: Date;
    mothers_occupation?: string;
    /** bank account information */
    bank_account_number?: string;
    bank_account_name?: string;
    bank_name?: string;
    bank_branch?: string;
    /** salary information */
    annual_salary?: number;
    monthly_salary?: number;
    daily_rate?: number;
    hourly_rate?: number;
    // pay type of the employee
    pay_type?: PaymentTypeEnum;

    /** government information */
    phic?: string;
    hdmf?: string;
    sss_no?: string;
    tin_no?: string;
    tax_exempt_code?: string;
    /** active status of the employee - temporary deactivation (e.g., on leave, suspended) */
    is_active?: boolean;
    /** remarks */
    remarks?: string;

    /** labor classification */
    labor_classification?: LaborClassificationEnum;
    labor_classification_status?: LaborClassificationStatusEnum;

    /** retention policy fields (DOLE compliance - 3 years minimum) */
    last_entry_date?: Date;
    retention_expiry_date?: Date;

    /** audit information */
    deleted_by?: string | null;
    deleted_at?: Date | null;
    created_by?: string | null;
    created_at?: Date; // Optional - auto-generated by TypeORM @CreateDateColumn()
    updated_by?: string | null;
    updated_at?: Date; // Optional - auto-generated by TypeORM @UpdateDateColumn()
  }) {
    this.id = dto.id;
    /** employment information */
    this.job_title_id = dto.job_title_id;
    this.job_title = dto.job_title;
    this.employment_type_id = dto.employment_type_id;
    this.employment_type = dto.employment_type;
    this.employment_status_id = dto.employment_status_id;
    this.employment_status = dto.employment_status;
    this.leave_type_id = dto.leave_type_id;
    this.leave_type = dto.leave_type;
    this.branch_id = dto.branch_id;
    this.branch = dto.branch;
    this.department_id = dto.department_id;
    this.department = dto.department;
    this.hire_date = dto.hire_date;
    this.end_date = dto.end_date;
    this.regularization_date = dto.regularization_date;
    this.id_number = dto.id_number;
    this.bio_number = dto.bio_number;
    this.image_path = dto.image_path;
    /** personal information */
    this.first_name = dto.first_name;
    this.middle_name = dto.middle_name;
    this.last_name = dto.last_name;
    this.suffix = dto.suffix;
    this.birth_date = dto.birth_date;
    this.religion_id = dto.religion_id;
    this.religion = dto.religion;
    this.civil_status_id = dto.civil_status_id;
    this.civil_status = dto.civil_status;
    this.age = dto.age;
    this.gender = dto.gender;
    this.citizen_ship_id = dto.citizen_ship_id;
    this.citizen_ship = dto.citizen_ship;
    this.height = dto.height;
    this.weight = dto.weight;
    /**address */
    this.home_address_street = dto.home_address_street;
    this.home_address_barangay_id = dto.home_address_barangay_id;
    this.home_address_barangay = dto.home_address_barangay;
    this.home_address_city_id = dto.home_address_city_id;
    this.home_address_city = dto.home_address_city;
    this.home_address_province_id = dto.home_address_province_id;
    this.home_address_province = dto.home_address_province;
    this.home_address_zip_code = dto.home_address_zip_code;
    this.present_address_street = dto.present_address_street;
    this.present_address_barangay_id = dto.present_address_barangay_id;
    this.present_address_barangay = dto.present_address_barangay;
    this.present_address_city_id = dto.present_address_city_id;
    this.present_address_city = dto.present_address_city;
    this.present_address_province_id = dto.present_address_province_id;
    this.present_address_zip_code = dto.present_address_zip_code;
    /** contact information */
    this.cellphone_number = dto.cellphone_number;
    this.telephone_number = dto.telephone_number;
    this.email = dto.email;
    /** emergency contact information */
    this.emergency_contact_name = dto.emergency_contact_name;
    this.emergency_contact_number = dto.emergency_contact_number;
    this.emergency_contact_relationship = dto.emergency_contact_relationship;
    this.emergency_contact_address = dto.emergency_contact_address;
    /** family information */
    this.husband_or_wife_name = dto.husband_or_wife_name;
    this.husband_or_wife_birth_date = dto.husband_or_wife_birth_date;
    this.husband_or_wife_occupation = dto.husband_or_wife_occupation;
    this.number_of_children = dto.number_of_children;
    this.fathers_name = dto.fathers_name;
    this.fathers_birth_date = dto.fathers_birth_date;
    this.fathers_occupation = dto.fathers_occupation;
    this.mothers_name = dto.mothers_name;
    this.mothers_birth_date = dto.mothers_birth_date;
    this.mothers_occupation = dto.mothers_occupation;
    /** bank account information */
    this.bank_account_number = dto.bank_account_number;
    this.bank_account_name = dto.bank_account_name;
    this.bank_name = dto.bank_name;
    this.bank_branch = dto.bank_branch;
    /** salary information */
    this.annual_salary = dto.annual_salary;
    this.monthly_salary = dto.monthly_salary;
    this.daily_rate = dto.daily_rate;
    this.hourly_rate = dto.hourly_rate;
    this.pay_type = dto.pay_type;
    /** government information */
    this.phic = dto.phic;
    this.hdmf = dto.hdmf;
    this.sss_no = dto.sss_no;
    this.tin_no = dto.tin_no;
    this.tax_exempt_code = dto.tax_exempt_code;
    /** active status of the employee - temporary deactivation (e.g., on leave, suspended) */
    this.is_active = dto.is_active ?? true; // Default to true if not provided
    /** remarks of the employee */
    this.remarks = dto.remarks;
    /** labor classification */
    this.labor_classification = dto.labor_classification;
    this.labor_classification_status = dto.labor_classification_status;

    /** retention policy fields (DOLE compliance - 3 years minimum) */
    this.last_entry_date = dto.last_entry_date ?? getPHDateTime();
    this.retention_expiry_date =
      dto.retention_expiry_date ??
      this.calculateRetentionExpiryDate(this.last_entry_date);

    /** audit information */
    this.deleted_by = dto.deleted_by ?? null;
    this.deleted_at = dto.deleted_at ?? null;
    this.created_by = dto.created_by ?? null;
    // created_at and updated_at are auto-generated by TypeORM
    // They will be set when the entity is saved to the database
    this.created_at = dto.created_at ?? getPHDateTime();
    this.updated_by = dto.updated_by ?? null;
    this.updated_at = dto.updated_at ?? getPHDateTime();
  }

  /**
   * Creates a new employee instance with validation
   *
   * This static factory method creates a new employee and validates it
   * to ensure it meets all business rules before being persisted.
   *
   * Why static? Because we're creating a NEW instance - there's no existing
   * instance to call the method on. Static methods can be called on the class
   * itself: Employee.create({...})
   *
   * @param params - Employee creation parameters
   * @returns A new validated Employee instance
   * @throws EmployeeBusinessException - If validation fails
   */
  static create(params: {
    /** employment information */
    job_title_id: number;
    employment_type_id: number;
    employment_status_id: number;
    leave_type_id?: number;
    branch_id: number;
    department_id: number;
    hire_date: Date;
    end_date?: Date;
    regularization_date?: Date;
    id_number: string;
    bio_number?: string;
    image_path?: string;
    /** personal information */
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    birth_date: Date;
    religion_id: number;
    civil_status_id: number;
    age?: number;
    gender?: GenderEnum;
    citizen_ship_id: number;
    height?: number;
    weight?: number;
    /**address */
    home_address_street: string;
    home_address_barangay_id: number;
    home_address_city_id: number;
    home_address_province_id: number;
    home_address_zip_code: string;
    present_address_street?: string;
    present_address_barangay_id?: number;
    present_address_city_id?: number;
    present_address_province_id?: number;
    present_address_zip_code?: string;
    /** contact information */
    cellphone_number?: string;
    telephone_number?: string;
    email?: string;
    /** emergency contact information */
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    emergency_contact_address?: string;
    /** family information */
    husband_or_wife_name?: string;
    husband_or_wife_birth_date?: Date;
    husband_or_wife_occupation?: string;
    number_of_children?: number;
    fathers_name?: string;
    fathers_birth_date?: Date;
    fathers_occupation?: string;
    mothers_name?: string;
    mothers_birth_date?: Date;
    mothers_occupation?: string;
    /** remarks */
    remarks?: string;
    /** active status of the employee - temporary deactivation (e.g., on leave, suspended) */
    is_active?: boolean;
    /** labor classification */
    labor_classification?: LaborClassificationEnum;
    labor_classification_status?: LaborClassificationStatusEnum;
    created_by?: string | null;
  }): Employee {
    const employee = new Employee({
      job_title_id: params.job_title_id,
      employment_type_id: params.employment_type_id,
      employment_status_id: params.employment_status_id,
      leave_type_id: params.leave_type_id,
      branch_id: params.branch_id,
      department_id: params.department_id,
      hire_date: params.hire_date,
      end_date: params.end_date,
      regularization_date: params.regularization_date,
      id_number: params.id_number,
      bio_number: params.bio_number,
      image_path: params.image_path,
      first_name: params.first_name,
      middle_name: params.middle_name,
      last_name: params.last_name,
      suffix: params.suffix,
      birth_date: params.birth_date,
      religion_id: params.religion_id,
      civil_status_id: params.civil_status_id,
      age: params.age,
      gender: params.gender,
      citizen_ship_id: params.citizen_ship_id,
      height: params.height,
      weight: params.weight,
      home_address_street: params.home_address_street,
      home_address_barangay_id: params.home_address_barangay_id,
      home_address_city_id: params.home_address_city_id,
      home_address_province_id: params.home_address_province_id,
      home_address_zip_code: params.home_address_zip_code,
      present_address_street: params.present_address_street,
      present_address_barangay_id: params.present_address_barangay_id,
      present_address_city_id: params.present_address_city_id,
      present_address_province_id: params.present_address_province_id,
      present_address_zip_code: params.present_address_zip_code,
      cellphone_number: params.cellphone_number,
      telephone_number: params.telephone_number,
      email: params.email,
      emergency_contact_name: params.emergency_contact_name,
      emergency_contact_number: params.emergency_contact_number,
      emergency_contact_relationship: params.emergency_contact_relationship,
      emergency_contact_address: params.emergency_contact_address,
      husband_or_wife_name: params.husband_or_wife_name,
      husband_or_wife_birth_date: params.husband_or_wife_birth_date,
      husband_or_wife_occupation: params.husband_or_wife_occupation,
      number_of_children: params.number_of_children,
      fathers_name: params.fathers_name,
      fathers_birth_date: params.fathers_birth_date,
      fathers_occupation: params.fathers_occupation,
      mothers_name: params.mothers_name,
      mothers_birth_date: params.mothers_birth_date,
      mothers_occupation: params.mothers_occupation,
      remarks: params.remarks,
      is_active: params.is_active ?? true, // Default to true if not provided
      labor_classification: params.labor_classification,
      labor_classification_status: params.labor_classification_status,
      created_by: params.created_by ?? null,
      // Note: created_at and updated_at are auto-generated by TypeORM
      // They will be set automatically when the entity is saved
    });
    // Validate the employee before returning
    employee.validate();
    return employee;
  }

  /**
   * Updates the employee details
   *
   * This method encapsulates the logic for updating employee properties.
   * It validates the new state before applying changes to ensure the employee
   * remains in a valid state. If validation fails, no changes are applied.
   *
   * @param dto - Employee data containing fields to update
   * @throws EmployeeBusinessException - If validation fails
   */
  update(dto: {
    /** employment information */
    job_title_id: number;
    employment_type_id: number;
    employment_status_id: number;
    leave_type_id?: number;
    branch_id: number;
    department_id: number;
    hire_date: Date;
    end_date?: Date;
    regularization_date?: Date;
    id_number: string;
    bio_number?: string;
    image_path?: string;
    /** personal information */
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    birth_date: Date;
    religion_id: number;
    civil_status_id: number;
    age?: number;
    gender?: GenderEnum;
    citizen_ship_id: number;
    height?: number;
    weight?: number;
    /**address */
    home_address_street: string;
    home_address_barangay_id: number;
    home_address_city_id: number;
    home_address_province_id: number;
    home_address_zip_code: string;
    present_address_street?: string;
    present_address_barangay_id?: number;
    present_address_city_id?: number;
    present_address_province_id?: number;
    present_address_zip_code?: string;
    /** contact information */
    cellphone_number?: string;
    telephone_number?: string;
    email?: string;
    /** emergency contact information */
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;
    emergency_contact_address?: string;
    /** family information */
    husband_or_wife_name?: string;
    husband_or_wife_birth_date?: Date;
    husband_or_wife_occupation?: string;
    number_of_children?: number;
    fathers_name?: string;
    fathers_birth_date?: Date;
    fathers_occupation?: string;
    mothers_name?: string;
    mothers_birth_date?: Date;
    mothers_occupation?: string;
    /** remarks */
    remarks?: string;
    updated_by?: string | null;

    /** active status of the employee - temporary deactivation (e.g., on leave, suspended) */
    is_active?: boolean;

    /** labor classification */
    labor_classification?: LaborClassificationEnum;
    labor_classification_status?: LaborClassificationStatusEnum;
  }): void {
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    // Create a temporary employee with the new values to validate before applying
    const tempEmployee = new Employee({
      id: this.id,
      job_title_id: dto.job_title_id,
      employment_type_id: dto.employment_type_id,
      employment_status_id: dto.employment_status_id,
      leave_type_id: dto.leave_type_id,
      branch_id: dto.branch_id,
      department_id: dto.department_id,
      hire_date: dto.hire_date,
      end_date: dto.end_date,
      regularization_date: dto.regularization_date,
      id_number: dto.id_number,
      bio_number: dto.bio_number,
      image_path: dto.image_path,
      first_name: dto.first_name,
      middle_name: dto.middle_name,
      last_name: dto.last_name,
      suffix: dto.suffix,
      birth_date: dto.birth_date,
      religion_id: dto.religion_id,
      civil_status_id: dto.civil_status_id,
      age: dto.age,
      gender: dto.gender,
      citizen_ship_id: dto.citizen_ship_id,
      height: dto.height,
      weight: dto.weight,
      home_address_street: dto.home_address_street,
      home_address_barangay_id: dto.home_address_barangay_id,
      home_address_city_id: dto.home_address_city_id,
      home_address_province_id: dto.home_address_province_id,
      home_address_zip_code: dto.home_address_zip_code,
      present_address_street: dto.present_address_street,
      present_address_barangay_id: dto.present_address_barangay_id,
      present_address_city_id: dto.present_address_city_id,
      present_address_province_id: dto.present_address_province_id,
      present_address_zip_code: dto.present_address_zip_code,
      cellphone_number: dto.cellphone_number,
      telephone_number: dto.telephone_number,
      email: dto.email,
      emergency_contact_name: dto.emergency_contact_name,
      emergency_contact_number: dto.emergency_contact_number,
      emergency_contact_relationship: dto.emergency_contact_relationship,
      emergency_contact_address: dto.emergency_contact_address,
      husband_or_wife_name: dto.husband_or_wife_name,
      husband_or_wife_birth_date: dto.husband_or_wife_birth_date,
      husband_or_wife_occupation: dto.husband_or_wife_occupation,
      number_of_children: dto.number_of_children,
      fathers_name: dto.fathers_name,
      fathers_birth_date: dto.fathers_birth_date,
      fathers_occupation: dto.fathers_occupation,
      mothers_name: dto.mothers_name,
      mothers_birth_date: dto.mothers_birth_date,
      mothers_occupation: dto.mothers_occupation,
      remarks: dto.remarks,
      is_active: dto.is_active ?? this.is_active, // Default to existing value if not provided
      labor_classification: dto.labor_classification,
      labor_classification_status: dto.labor_classification_status,
      created_at: this.created_at, // Use existing value for validation
      updated_at: this.updated_at, // Use existing value for validation
    });
    // Validate the new state before applying changes
    tempEmployee.validate();

    // Apply changes only if validation passes (data is already validated)
    this.job_title_id = dto.job_title_id;
    this.employment_type_id = dto.employment_type_id;
    this.employment_status_id = dto.employment_status_id;
    this.leave_type_id = dto.leave_type_id;
    this.branch_id = dto.branch_id;
    this.department_id = dto.department_id;
    this.hire_date = dto.hire_date;
    this.end_date = dto.end_date;
    this.regularization_date = dto.regularization_date;
    this.id_number = dto.id_number;
    this.bio_number = dto.bio_number;
    this.image_path = dto.image_path;
    this.first_name = dto.first_name;
    this.middle_name = dto.middle_name;
    this.last_name = dto.last_name;
    this.suffix = dto.suffix;
    this.birth_date = dto.birth_date;
    this.religion_id = dto.religion_id;
    this.civil_status_id = dto.civil_status_id;
    this.age = dto.age;
    this.gender = dto.gender;
    this.citizen_ship_id = dto.citizen_ship_id;
    this.height = dto.height;
    this.weight = dto.weight;
    this.home_address_street = dto.home_address_street;
    this.home_address_barangay_id = dto.home_address_barangay_id;
    this.home_address_city_id = dto.home_address_city_id;
    this.home_address_province_id = dto.home_address_province_id;
    this.home_address_zip_code = dto.home_address_zip_code;
    this.present_address_street = dto.present_address_street;
    this.present_address_barangay_id = dto.present_address_barangay_id;
    this.present_address_city_id = dto.present_address_city_id;
    this.present_address_province_id = dto.present_address_province_id;
    this.present_address_zip_code = dto.present_address_zip_code;
    this.cellphone_number = dto.cellphone_number;
    this.telephone_number = dto.telephone_number;
    this.email = dto.email;
    this.emergency_contact_name = dto.emergency_contact_name;
    this.emergency_contact_number = dto.emergency_contact_number;
    this.emergency_contact_relationship = dto.emergency_contact_relationship;
    this.emergency_contact_address = dto.emergency_contact_address;
    this.husband_or_wife_name = dto.husband_or_wife_name;
    this.husband_or_wife_birth_date = dto.husband_or_wife_birth_date;
    this.husband_or_wife_occupation = dto.husband_or_wife_occupation;
    this.number_of_children = dto.number_of_children;
    this.fathers_name = dto.fathers_name;
    this.fathers_birth_date = dto.fathers_birth_date;
    this.fathers_occupation = dto.fathers_occupation;
    this.mothers_name = dto.mothers_name;
    this.mothers_birth_date = dto.mothers_birth_date;
    this.mothers_occupation = dto.mothers_occupation;
    this.remarks = dto.remarks;
    this.is_active = dto.is_active ?? this.is_active; // Default to existing value if not provided
    this.labor_classification = dto.labor_classification;
    this.labor_classification_status = dto.labor_classification_status;
    this.updated_by = dto.updated_by ?? null;

    // DOLE Compliance: Update last entry date when employee record is modified
    this.updateLastEntryDate();

    // Note: updated_at is auto-generated by TypeORM @UpdateDateColumn() when saved
    // We don't set it here - it will be updated automatically by TypeORM on persistence
  }

  /**
   * Updates the bank details of the employee
   *
   * This method encapsulates the logic for updating the bank details of the employee.
   * It validates the new state before applying changes to ensure the employee
   * remains in a valid state. If validation fails, no changes are applied.
   *
   * @param dto - Bank details to update
   * @throws EmployeeBusinessException - If validation fails
   */
  updateBankDetails(dto: {
    bank_account_number: string;
    bank_account_name: string;
    bank_name: string;
    bank_branch: string;
  }): void {
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    // Create a temporary employee with the new values to validate before applying
    const tempEmployee = new Employee({
      id: this.id,
      job_title_id: this.job_title_id,
      employment_type_id: this.employment_type_id,
      employment_status_id: this.employment_status_id,
      leave_type_id: this.leave_type_id,
      branch_id: this.branch_id,
      department_id: this.department_id,
      hire_date: this.hire_date,
      end_date: this.end_date,
      regularization_date: this.regularization_date,
      id_number: this.id_number,
      bio_number: this.bio_number,
      image_path: this.image_path,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      suffix: this.suffix,
      birth_date: this.birth_date,
      religion_id: this.religion_id,
      civil_status_id: this.civil_status_id,
      age: this.age,
      gender: this.gender,
      citizen_ship_id: this.citizen_ship_id,
      height: this.height,
      weight: this.weight,
      home_address_street: this.home_address_street,
      home_address_barangay_id: this.home_address_barangay_id,
      home_address_city_id: this.home_address_city_id,
      home_address_province_id: this.home_address_province_id,
      home_address_zip_code: this.home_address_zip_code,
      present_address_street: this.present_address_street,
      present_address_barangay_id: this.present_address_barangay_id,
      present_address_city_id: this.present_address_city_id,
      present_address_province_id: this.present_address_province_id,
      present_address_zip_code: this.present_address_zip_code,
      cellphone_number: this.cellphone_number,
      telephone_number: this.telephone_number,
      email: this.email,
      emergency_contact_name: this.emergency_contact_name,
      emergency_contact_number: this.emergency_contact_number,
      emergency_contact_relationship: this.emergency_contact_relationship,
      emergency_contact_address: this.emergency_contact_address,
      husband_or_wife_name: this.husband_or_wife_name,
      husband_or_wife_birth_date: this.husband_or_wife_birth_date,
      husband_or_wife_occupation: this.husband_or_wife_occupation,
      number_of_children: this.number_of_children,
      fathers_name: this.fathers_name,
      fathers_birth_date: this.fathers_birth_date,
      fathers_occupation: this.fathers_occupation,
      mothers_name: this.mothers_name,
      mothers_birth_date: this.mothers_birth_date,
      mothers_occupation: this.mothers_occupation,
      bank_account_number: dto.bank_account_number,
      bank_account_name: dto.bank_account_name,
      bank_name: dto.bank_name,
      bank_branch: dto.bank_branch,
      annual_salary: this.annual_salary,
      monthly_salary: this.monthly_salary,
      daily_rate: this.daily_rate,
      hourly_rate: this.hourly_rate,
      pay_type: this.pay_type,
      phic: this.phic,
      hdmf: this.hdmf,
      sss_no: this.sss_no,
      tin_no: this.tin_no,
      tax_exempt_code: this.tax_exempt_code,
      is_active: this.is_active,
      created_at: this.created_at, // Use existing value for validation
      updated_at: this.updated_at, // Use existing value for validation
    });
    // Validate the new state before applying changes
    tempEmployee.validate();

    // Apply changes only if validation passes (data is already validated)
    this.bank_account_number = dto.bank_account_number;
    this.bank_account_name = dto.bank_account_name;
    this.bank_name = dto.bank_name;
    this.bank_branch = dto.bank_branch;

    // DOLE Compliance: Update last entry date when employee record is modified
    this.updateLastEntryDate();

    // Note: updated_at is auto-generated by TypeORM @UpdateDateColumn() when saved
    // We don't set it here - it will be updated automatically by TypeORM on persistence
  }

  /**
   * Updates the salary details of the employee
   *
   * This method encapsulates the logic for updating the salary details of the employee.
   * It validates the new state before applying changes to ensure the employee
   * remains in a valid state. If validation fails, no changes are applied.
   *
   * @param dto - Salary details to update
   * @throws EmployeeBusinessException - If validation fails
   */
  updateSalaryDetails(dto: {
    annual_salary: number;
    monthly_salary: number;
    daily_rate: number;
    hourly_rate: number;
    pay_type: PaymentTypeEnum;
  }): void {
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    // Create a temporary employee with the new values to validate before applying
    const tempEmployee = new Employee({
      id: this.id,
      job_title_id: this.job_title_id,
      employment_type_id: this.employment_type_id,
      employment_status_id: this.employment_status_id,
      leave_type_id: this.leave_type_id,
      branch_id: this.branch_id,
      department_id: this.department_id,
      hire_date: this.hire_date,
      end_date: this.end_date,
      regularization_date: this.regularization_date,
      id_number: this.id_number,
      bio_number: this.bio_number,
      image_path: this.image_path,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      suffix: this.suffix,
      birth_date: this.birth_date,
      religion_id: this.religion_id,
      civil_status_id: this.civil_status_id,
      age: this.age,
      gender: this.gender,
      citizen_ship_id: this.citizen_ship_id,
      height: this.height,
      weight: this.weight,
      home_address_street: this.home_address_street,
      home_address_barangay_id: this.home_address_barangay_id,
      home_address_city_id: this.home_address_city_id,
      home_address_province_id: this.home_address_province_id,
      home_address_zip_code: this.home_address_zip_code,
      present_address_street: this.present_address_street,
      present_address_barangay_id: this.present_address_barangay_id,
      present_address_city_id: this.present_address_city_id,
      present_address_province_id: this.present_address_province_id,
      present_address_zip_code: this.present_address_zip_code,
      cellphone_number: this.cellphone_number,
      telephone_number: this.telephone_number,
      email: this.email,
      emergency_contact_name: this.emergency_contact_name,
      emergency_contact_number: this.emergency_contact_number,
      emergency_contact_relationship: this.emergency_contact_relationship,
      emergency_contact_address: this.emergency_contact_address,
      husband_or_wife_name: this.husband_or_wife_name,
      husband_or_wife_birth_date: this.husband_or_wife_birth_date,
      husband_or_wife_occupation: this.husband_or_wife_occupation,
      number_of_children: this.number_of_children,
      fathers_name: this.fathers_name,
      fathers_birth_date: this.fathers_birth_date,
      fathers_occupation: this.fathers_occupation,
      mothers_name: this.mothers_name,
      mothers_birth_date: this.mothers_birth_date,
      mothers_occupation: this.mothers_occupation,
      bank_account_number: this.bank_account_number,
      bank_account_name: this.bank_account_name,
      bank_name: this.bank_name,
      bank_branch: this.bank_branch,
      annual_salary: dto.annual_salary,
      monthly_salary: dto.monthly_salary,
      daily_rate: dto.daily_rate,
      hourly_rate: dto.hourly_rate,
      pay_type: dto.pay_type,
      phic: this.phic,
      hdmf: this.hdmf,
      sss_no: this.sss_no,
      tin_no: this.tin_no,
      tax_exempt_code: this.tax_exempt_code,
      is_active: this.is_active,
      created_at: this.created_at, // Use existing value for validation
      updated_at: this.updated_at, // Use existing value for validation
    });
    // Validate the new state before applying changes
    tempEmployee.validate();

    // Apply changes only if validation passes (data is already validated)
    this.annual_salary = dto.annual_salary;
    this.monthly_salary = dto.monthly_salary;
    this.daily_rate = dto.daily_rate;
    this.hourly_rate = dto.hourly_rate;
    this.pay_type = dto.pay_type;

    // DOLE Compliance: Update last entry date when employee record is modified
    this.updateLastEntryDate();

    // Note: updated_at is auto-generated by TypeORM @UpdateDateColumn() when saved
    // We don't set it here - it will be updated automatically by TypeORM on persistence
  }

  /**
   * Updates the government details of the employee
   *
   * This method encapsulates the logic for updating the government details of the employee.
   * It validates the new state before applying changes to ensure the employee
   * remains in a valid state. If validation fails, no changes are applied.
   *
   * @param dto - Government details to update
   * @throws EmployeeBusinessException - If validation fails
   */
  updateGovernmentDetails(dto: {
    phic: string;
    hdmf: string;
    sss_no: string;
    tin_no: string;
    tax_exempt_code: string;
  }): void {
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    // Create a temporary employee with the new values to validate before applying
    const tempEmployee = new Employee({
      id: this.id,
      job_title_id: this.job_title_id,
      employment_type_id: this.employment_type_id,
      employment_status_id: this.employment_status_id,
      leave_type_id: this.leave_type_id,
      branch_id: this.branch_id,
      department_id: this.department_id,
      hire_date: this.hire_date,
      end_date: this.end_date,
      regularization_date: this.regularization_date,
      id_number: this.id_number,
      bio_number: this.bio_number,
      image_path: this.image_path,
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      suffix: this.suffix,
      birth_date: this.birth_date,
      religion_id: this.religion_id,
      civil_status_id: this.civil_status_id,
      age: this.age,
      gender: this.gender,
      citizen_ship_id: this.citizen_ship_id,
      height: this.height,
      weight: this.weight,
      home_address_street: this.home_address_street,
      home_address_barangay_id: this.home_address_barangay_id,
      home_address_city_id: this.home_address_city_id,
      home_address_province_id: this.home_address_province_id,
      home_address_zip_code: this.home_address_zip_code,
      present_address_street: this.present_address_street,
      present_address_barangay_id: this.present_address_barangay_id,
      present_address_city_id: this.present_address_city_id,
      present_address_province_id: this.present_address_province_id,
      present_address_zip_code: this.present_address_zip_code,
      cellphone_number: this.cellphone_number,
      telephone_number: this.telephone_number,
      email: this.email,
      emergency_contact_name: this.emergency_contact_name,
      emergency_contact_number: this.emergency_contact_number,
      emergency_contact_relationship: this.emergency_contact_relationship,
      emergency_contact_address: this.emergency_contact_address,
      husband_or_wife_name: this.husband_or_wife_name,
      husband_or_wife_birth_date: this.husband_or_wife_birth_date,
      husband_or_wife_occupation: this.husband_or_wife_occupation,
      number_of_children: this.number_of_children,
      fathers_name: this.fathers_name,
      fathers_birth_date: this.fathers_birth_date,
      fathers_occupation: this.fathers_occupation,
      mothers_name: this.mothers_name,
      mothers_birth_date: this.mothers_birth_date,
      mothers_occupation: this.mothers_occupation,
      bank_account_number: this.bank_account_number,
      bank_account_name: this.bank_account_name,
      bank_name: this.bank_name,
      bank_branch: this.bank_branch,
      annual_salary: this.annual_salary,
      monthly_salary: this.monthly_salary,
      daily_rate: this.daily_rate,
      hourly_rate: this.hourly_rate,
      pay_type: this.pay_type,
      phic: dto.phic,
      hdmf: dto.hdmf,
      sss_no: dto.sss_no,
      tin_no: dto.tin_no,
      tax_exempt_code: dto.tax_exempt_code,
      is_active: this.is_active,
      created_at: this.created_at, // Use existing value for validation
      updated_at: this.updated_at, // Use existing value for validation
    });
    // Validate the new state before applying changes
    tempEmployee.validate();

    // Apply changes only if validation passes (data is already validated)
    this.phic = dto.phic;
    this.hdmf = dto.hdmf;
    this.sss_no = dto.sss_no;
    this.tin_no = dto.tin_no;
    this.tax_exempt_code = dto.tax_exempt_code;

    // DOLE Compliance: Update last entry date when employee record is modified
    this.updateLastEntryDate();

    // Note: updated_at is auto-generated by TypeORM @UpdateDateColumn() when saved
    // We don't set it here - it will be updated automatically by TypeORM on persistence
  }

  /**
   * Updates the image path of the employee
   *
   * This method encapsulates the logic for updating the image path of the employee.
   * It validates the new state before applying changes to ensure the employee
   * remains in a valid state. If validation fails, no changes are applied.
   *
   * @param image_path - Image path to update
   * @param updated_by - Username of the user performing the update
   * @throws EmployeeBusinessException - If validation fails
   */
  updateImagePath(image_path: string, updated_by?: string | null): void {
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is archived and cannot be updated',
        HTTP_STATUS.CONFLICT,
      );
    }

    // Validate image path if provided
    if (image_path && image_path.trim().length === 0) {
      throw new EmployeeBusinessException(
        'Image path cannot be empty if provided.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (image_path && image_path.length > 500) {
      throw new EmployeeBusinessException(
        'Image path must not exceed 500 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Apply changes only if validation passes
    this.image_path = image_path;
    this.updated_by = updated_by ?? null;

    // DOLE Compliance: Update last entry date when employee record is modified
    this.updateLastEntryDate();

    // Note: updated_at is auto-generated by TypeORM @UpdateDateColumn() when saved
    // We don't set it here - it will be updated automatically by TypeORM on persistence
  }

  /**
   * Calculates the retention expiry date (last_entry_date + 3 years)
   * DOLE requirement: Records must be retained for at least 3 years from last entry
   *
   * @param last_entry_date - Date of last entry/activity
   * @returns Date that is 3 years after last_entry_date
   */
  private calculateRetentionExpiryDate(last_entry_date: Date): Date {
    const expiry_date = new Date(last_entry_date);
    expiry_date.setFullYear(expiry_date.getFullYear() + 3);
    return expiry_date;
  }

  /**
   * Updates the last entry date and recalculates retention expiry date
   * Should be called whenever the employee record is updated
   */
  updateLastEntryDate(): void {
    const current_date = getPHDateTime();
    this.last_entry_date = current_date;
    this.retention_expiry_date =
      this.calculateRetentionExpiryDate(current_date);
  }

  /**
   * Checks if the employee record retention period has expired
   *
   * Note: This is for reporting/compliance purposes only.
   * Archiving (soft delete) is always allowed - records are preserved in database.
   * Retention policy only applies to permanent deletion (hard delete), not soft deletion.
   *
   * DOLE requirement: Records must be retained for at least 3 years from last entry
   *
   * @returns true if retention period has expired, false otherwise
   */
  canBeArchived(): boolean {
    if (!this.retention_expiry_date) {
      // If no retention date set, allow archiving (for backward compatibility)
      return true;
    }
    const today = getPHDateTime();
    return today >= this.retention_expiry_date;
  }

  /**
   * Archives (soft deletes) the employee
   *
   * Soft delete marks the employee as inactive/archived but preserves the record in the database.
   * This is allowed at any time (e.g., when employee resigns) because the record is still preserved.
   *
   * DOLE Compliance:
   * - Soft delete (archive) is allowed anytime - records are still preserved
   * - Retention policy only applies to permanent deletion (hard delete), not soft deletion
   * - Retention dates are tracked for compliance reporting purposes
   *
   * @param deleted_by - Username of the user performing the archive
   * @throws EmployeeBusinessException - If the employee is already archived
   */
  archive(deleted_by: string): void {
    // Validate if the employee is not already archived
    if (this.deleted_at) {
      throw new EmployeeBusinessException(
        'Employee is already archived.',
        HTTP_STATUS.CONFLICT, // Conflict - resource already in the desired state
      );
    }

    // Soft delete (archive) is always allowed - records are preserved in database
    // Retention policy only applies to permanent deletion, not soft deletion
    // Apply archive operation
    this.deleted_at = getPHDateTime();
    this.deleted_by = deleted_by;

    // Note: We do NOT update last_entry_date when archiving
    // The retention period is based on the last actual data update, not the archive date
  }

  /**
   * Restores a previously archived employee
   */
  restore(): void {
    if (!this.deleted_at) {
      throw new EmployeeBusinessException(
        `Employee with ID ${this.id} is not archived.`,
        HTTP_STATUS.CONFLICT,
      );
    }

    // restore the employee
    this.deleted_at = null;
    this.deleted_by = null;
  }

  /**
   * Validates the bank details of the employee
   *
   * @throws EmployeeBusinessException - If validation fails
   */
  validateBankDetails(): void {
    if (
      !this.bank_account_number ||
      this.bank_account_number.trim().length === 0
    ) {
      throw new EmployeeBusinessException(
        'Bank account number is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.bank_account_number.length > 50) {
      throw new EmployeeBusinessException(
        'Bank account number must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.bank_account_name || this.bank_account_name.trim().length === 0) {
      throw new EmployeeBusinessException(
        'Bank account name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.bank_account_name.length > 100) {
      throw new EmployeeBusinessException(
        'Bank account name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.bank_name || this.bank_name.trim().length === 0) {
      throw new EmployeeBusinessException(
        'Bank name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.bank_name.length > 100) {
      throw new EmployeeBusinessException(
        'Bank name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    if (!this.bank_branch || this.bank_branch.trim().length === 0) {
      throw new EmployeeBusinessException(
        'Bank branch is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.bank_branch.length > 100) {
      throw new EmployeeBusinessException(
        'Bank branch must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  /**
   * Validates the salary details of the employee
   *
   * @throws EmployeeBusinessException - If validation fails
   */
  validateSalaryDetails(): void {
    // Validate salary information if provided
    // Annual salary validation
    if (this.annual_salary !== undefined && this.annual_salary !== null) {
      if (
        typeof this.annual_salary !== 'number' ||
        !isFinite(this.annual_salary)
      ) {
        throw new EmployeeBusinessException(
          'Annual salary must be a valid number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.annual_salary < 0) {
        throw new EmployeeBusinessException(
          'Annual salary cannot be negative.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate decimal places (max 2 decimal places)
      // Check if the number has more than 2 decimal places
      const multiplied = this.annual_salary * 100;
      if (Math.abs(multiplied - Math.round(multiplied)) > 0.0001) {
        throw new EmployeeBusinessException(
          'Annual salary must have at most 2 decimal places.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Monthly salary validation
    if (this.monthly_salary !== undefined && this.monthly_salary !== null) {
      if (
        typeof this.monthly_salary !== 'number' ||
        !isFinite(this.monthly_salary)
      ) {
        throw new EmployeeBusinessException(
          'Monthly salary must be a valid number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.monthly_salary < 0) {
        throw new EmployeeBusinessException(
          'Monthly salary cannot be negative.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate decimal places (max 2 decimal places)
      // Check if the number has more than 2 decimal places
      const multiplied = this.monthly_salary * 100;
      if (Math.abs(multiplied - Math.round(multiplied)) > 0.0001) {
        throw new EmployeeBusinessException(
          'Monthly salary must have at most 2 decimal places.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Daily rate validation
    if (this.daily_rate !== undefined && this.daily_rate !== null) {
      if (typeof this.daily_rate !== 'number' || !isFinite(this.daily_rate)) {
        throw new EmployeeBusinessException(
          'Daily rate must be a valid number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.daily_rate < 0) {
        throw new EmployeeBusinessException(
          'Daily rate cannot be negative.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate decimal places (max 2 decimal places)
      // Check if the number has more than 2 decimal places
      const multiplied = this.daily_rate * 100;
      if (Math.abs(multiplied - Math.round(multiplied)) > 0.0001) {
        throw new EmployeeBusinessException(
          'Daily rate must have at most 2 decimal places.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Hourly rate validation
    if (this.hourly_rate !== undefined && this.hourly_rate !== null) {
      if (typeof this.hourly_rate !== 'number' || !isFinite(this.hourly_rate)) {
        throw new EmployeeBusinessException(
          'Hourly rate must be a valid number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.hourly_rate < 0) {
        throw new EmployeeBusinessException(
          'Hourly rate cannot be negative.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate decimal places (max 2 decimal places)
      // Check if the number has more than 2 decimal places
      const multiplied = this.hourly_rate * 100;
      if (Math.abs(multiplied - Math.round(multiplied)) > 0.0001) {
        throw new EmployeeBusinessException(
          'Hourly rate must have at most 2 decimal places.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }

  /**
   * Validates the government details of the employee
   *
   * @throws EmployeeBusinessException - If validation fails
   */
  validateGovernmentDetails(): void {
    // Validate government identification numbers if provided
    // PHIC (PhilHealth) - 12 digits, format: ##-#########-# or 12 digits
    if (this.phic !== undefined && this.phic !== null) {
      if (this.phic.trim().length === 0) {
        throw new EmployeeBusinessException(
          'PHIC number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.phic.length > 50) {
        throw new EmployeeBusinessException(
          'PHIC number must not exceed 50 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Remove hyphens for validation, then check if it's 12 digits
      const phic_digits_only = this.phic.replace(/-/g, '');
      const phic_pattern = /^\d{12}$/;
      if (!phic_pattern.test(phic_digits_only)) {
        throw new EmployeeBusinessException(
          'PHIC number must be 12 digits. Format: ##-#########-# or 12 consecutive digits.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate format if hyphens are present (should be ##-#########-#)
      if (this.phic.includes('-')) {
        const phic_formatted_pattern = /^\d{2}-\d{9}-\d{1}$/;
        if (!phic_formatted_pattern.test(this.phic)) {
          throw new EmployeeBusinessException(
            'PHIC number format is invalid. Expected format: ##-#########-# (e.g., 12-345678901-2).',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
      }
    }

    // HDMF (Pag-IBIG) - 12 digits, format: ####-####-#### or 12 digits
    if (this.hdmf !== undefined && this.hdmf !== null) {
      if (this.hdmf.trim().length === 0) {
        throw new EmployeeBusinessException(
          'HDMF number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.hdmf.length > 50) {
        throw new EmployeeBusinessException(
          'HDMF number must not exceed 50 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Remove hyphens for validation, then check if it's 12 digits
      const hdmf_digits_only = this.hdmf.replace(/-/g, '');
      const hdmf_pattern = /^\d{12}$/;
      if (!hdmf_pattern.test(hdmf_digits_only)) {
        throw new EmployeeBusinessException(
          'HDMF number must be 12 digits. Format: ####-####-#### or 12 consecutive digits.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate format if hyphens are present (should be ####-####-####)
      if (this.hdmf.includes('-')) {
        const hdmf_formatted_pattern = /^\d{4}-\d{4}-\d{4}$/;
        if (!hdmf_formatted_pattern.test(this.hdmf)) {
          throw new EmployeeBusinessException(
            'HDMF number format is invalid. Expected format: ####-####-#### (e.g., 1234-5678-9012).',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
      }
    }

    // SSS - 10 digits, format: ##-#######-# or 10 digits
    if (this.sss_no !== undefined && this.sss_no !== null) {
      if (this.sss_no.trim().length === 0) {
        throw new EmployeeBusinessException(
          'SSS number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.sss_no.length > 50) {
        throw new EmployeeBusinessException(
          'SSS number must not exceed 50 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Remove hyphens for validation, then check if it's 10 digits
      const sss_digits_only = this.sss_no.replace(/-/g, '');
      const sss_pattern = /^\d{10}$/;
      if (!sss_pattern.test(sss_digits_only)) {
        throw new EmployeeBusinessException(
          'SSS number must be 10 digits. Format: ##-#######-# or 10 consecutive digits.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate format if hyphens are present (should be ##-#######-#)
      if (this.sss_no.includes('-')) {
        const sss_formatted_pattern = /^\d{2}-\d{7}-\d{1}$/;
        if (!sss_formatted_pattern.test(this.sss_no)) {
          throw new EmployeeBusinessException(
            'SSS number format is invalid. Expected format: ##-#######-# (e.g., 12-3456789-0).',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
      }
    }

    // TIN - 9-12 digits, format: ###-###-### or ###-###-###-### or 9-12 digits
    if (this.tin_no !== undefined && this.tin_no !== null) {
      if (this.tin_no.trim().length === 0) {
        throw new EmployeeBusinessException(
          'TIN number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.tin_no.length > 50) {
        throw new EmployeeBusinessException(
          'TIN number must not exceed 50 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Remove hyphens for validation, then check if it's 9-12 digits
      const tin_digits_only = this.tin_no.replace(/-/g, '');
      const tin_pattern = /^\d{9,12}$/;
      if (!tin_pattern.test(tin_digits_only)) {
        throw new EmployeeBusinessException(
          'TIN number must be 9-12 digits. Format: ###-###-### or ###-###-###-### or 9-12 consecutive digits.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate format if hyphens are present
      if (this.tin_no.includes('-')) {
        // Can be ###-###-### (9 digits) or ###-###-###-### (12 digits)
        const tin_formatted_pattern_9 = /^\d{3}-\d{3}-\d{3}$/;
        const tin_formatted_pattern_12 = /^\d{3}-\d{3}-\d{3}-\d{3}$/;
        if (
          !tin_formatted_pattern_9.test(this.tin_no) &&
          !tin_formatted_pattern_12.test(this.tin_no)
        ) {
          throw new EmployeeBusinessException(
            'TIN number format is invalid. Expected format: ###-###-### (9 digits) or ###-###-###-### (12 digits).',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
      }
    }
  }

  /**
   * Validates the employee against business rules
   *
   * This method enforces domain validation rules such as:
   * - Required fields must be present
   * - Field lengths must be within limits
   * - Dates must be valid
   * - IDs must be positive numbers
   *
   * @throws EmployeeBusinessException - If validation fails
   */
  validate(): void {
    const today = new Date(); // Used for date validations throughout the method

    // Validate required employment information
    if (!this.job_title_id || this.job_title_id <= 0) {
      throw new EmployeeBusinessException(
        'Job title ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.employment_type_id || this.employment_type_id <= 0) {
      throw new EmployeeBusinessException(
        'Employment type ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.employment_status_id || this.employment_status_id <= 0) {
      throw new EmployeeBusinessException(
        'Employment status ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate leave_type_id: if employment_status is 'on-leave', leave_type_id must be provided
    // Note: This validation assumes employment_status string contains 'on-leave' or similar
    // In practice, you might want to check against employment_status_id or a constant
    if (
      this.employment_status?.toLowerCase().includes('on-leave') &&
      (!this.leave_type_id || this.leave_type_id <= 0)
    ) {
      throw new EmployeeBusinessException(
        'Leave type ID is required when employment status is on-leave.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.branch_id || this.branch_id <= 0) {
      throw new EmployeeBusinessException(
        'Branch ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.department_id || this.department_id <= 0) {
      throw new EmployeeBusinessException(
        'Department ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      !this.hire_date ||
      !(this.hire_date instanceof Date) ||
      isNaN(this.hire_date.getTime())
    ) {
      throw new EmployeeBusinessException(
        'Hire date is required and must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.id_number || this.id_number.trim().length === 0) {
      throw new EmployeeBusinessException(
        'ID number is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.id_number.length > 50) {
      throw new EmployeeBusinessException(
        'ID number must not exceed 50 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate required personal information
    if (!this.first_name || this.first_name.trim().length === 0) {
      throw new EmployeeBusinessException(
        'First name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.first_name.length > 100) {
      throw new EmployeeBusinessException(
        'First name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.last_name || this.last_name.trim().length === 0) {
      throw new EmployeeBusinessException(
        'Last name is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.last_name.length > 100) {
      throw new EmployeeBusinessException(
        'Last name must not exceed 100 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      !this.birth_date ||
      !(this.birth_date instanceof Date) ||
      isNaN(this.birth_date.getTime())
    ) {
      throw new EmployeeBusinessException(
        'Birth date is required and must be a valid date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.religion_id || this.religion_id <= 0) {
      throw new EmployeeBusinessException(
        'Religion ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.civil_status_id || this.civil_status_id <= 0) {
      throw new EmployeeBusinessException(
        'Civil status ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.citizen_ship_id || this.citizen_ship_id <= 0) {
      throw new EmployeeBusinessException(
        'Citizenship ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate address information
    if (
      !this.home_address_street ||
      this.home_address_street.trim().length === 0
    ) {
      throw new EmployeeBusinessException(
        'Home address street is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.home_address_street.length > 255) {
      throw new EmployeeBusinessException(
        'Home address street must not exceed 255 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.home_address_barangay_id || this.home_address_barangay_id <= 0) {
      throw new EmployeeBusinessException(
        'Home address barangay ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.home_address_city_id || this.home_address_city_id <= 0) {
      throw new EmployeeBusinessException(
        'Home address city ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (!this.home_address_province_id || this.home_address_province_id <= 0) {
      throw new EmployeeBusinessException(
        'Home address province ID is required and must be a positive number.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (
      !this.home_address_zip_code ||
      this.home_address_zip_code.trim().length === 0
    ) {
      throw new EmployeeBusinessException(
        'Home address zip code is required and cannot be empty.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    if (this.home_address_zip_code.length > 10) {
      throw new EmployeeBusinessException(
        'Home address zip code must not exceed 10 characters.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate email format if provided
    if (this.email && this.email.trim().length > 0) {
      const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email_pattern.test(this.email)) {
        throw new EmployeeBusinessException(
          'Email must be a valid email address.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.email.length > 255) {
        throw new EmployeeBusinessException(
          'Email must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate cellphone number if provided
    if (this.cellphone_number !== undefined && this.cellphone_number !== null) {
      if (this.cellphone_number.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Cellphone number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.cellphone_number.length < 10) {
        throw new EmployeeBusinessException(
          'Cellphone number must be at least 10 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.cellphone_number.length > 15) {
        throw new EmployeeBusinessException(
          'Cellphone number must not exceed 15 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate phone number pattern (numbers, plus signs, hyphens, spaces, parentheses)
      const phone_pattern = /^[0-9+\-\s()]+$/;
      if (!phone_pattern.test(this.cellphone_number)) {
        throw new EmployeeBusinessException(
          'Cellphone number can only contain numbers, plus signs, hyphens, spaces, and parentheses.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate telephone number if provided
    if (this.telephone_number !== undefined && this.telephone_number !== null) {
      if (this.telephone_number.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Telephone number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.telephone_number.length < 7) {
        throw new EmployeeBusinessException(
          'Telephone number must be at least 7 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.telephone_number.length > 15) {
        throw new EmployeeBusinessException(
          'Telephone number must not exceed 15 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate phone number pattern (numbers, plus signs, hyphens, spaces, parentheses)
      const phone_pattern = /^[0-9+\-\s()]+$/;
      if (!phone_pattern.test(this.telephone_number)) {
        throw new EmployeeBusinessException(
          'Telephone number can only contain numbers, plus signs, hyphens, spaces, and parentheses.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate emergency contact information if provided
    // Emergency contact name validation
    if (
      this.emergency_contact_name !== undefined &&
      this.emergency_contact_name !== null
    ) {
      if (this.emergency_contact_name.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Emergency contact name cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.emergency_contact_name.length > 255) {
        throw new EmployeeBusinessException(
          'Emergency contact name must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate name pattern (letters, spaces, hyphens, apostrophes, periods)
      const name_pattern = /^[a-zA-Z\s\-'.,]+$/;
      if (!name_pattern.test(this.emergency_contact_name)) {
        throw new EmployeeBusinessException(
          'Emergency contact name can only contain letters, spaces, hyphens, apostrophes, and periods.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Emergency contact number validation
    if (
      this.emergency_contact_number !== undefined &&
      this.emergency_contact_number !== null
    ) {
      if (this.emergency_contact_number.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Emergency contact number cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.emergency_contact_number.length < 10) {
        throw new EmployeeBusinessException(
          'Emergency contact number must be at least 10 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.emergency_contact_number.length > 15) {
        throw new EmployeeBusinessException(
          'Emergency contact number must not exceed 15 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate phone number pattern (numbers, plus signs, hyphens, spaces, parentheses)
      const phone_pattern = /^[0-9+\-\s()]+$/;
      if (!phone_pattern.test(this.emergency_contact_number)) {
        throw new EmployeeBusinessException(
          'Emergency contact number can only contain numbers, plus signs, hyphens, spaces, and parentheses.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Emergency contact relationship validation
    if (
      this.emergency_contact_relationship !== undefined &&
      this.emergency_contact_relationship !== null
    ) {
      if (this.emergency_contact_relationship.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Emergency contact relationship cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.emergency_contact_relationship.length > 100) {
        throw new EmployeeBusinessException(
          'Emergency contact relationship must not exceed 100 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate relationship pattern (letters, spaces, hyphens, apostrophes, periods)
      const relationship_pattern = /^[a-zA-Z\s\-'.,]+$/;
      if (!relationship_pattern.test(this.emergency_contact_relationship)) {
        throw new EmployeeBusinessException(
          'Emergency contact relationship can only contain letters, spaces, hyphens, apostrophes, and periods.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Emergency contact address validation
    if (
      this.emergency_contact_address !== undefined &&
      this.emergency_contact_address !== null
    ) {
      if (this.emergency_contact_address.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Emergency contact address cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.emergency_contact_address.length > 500) {
        throw new EmployeeBusinessException(
          'Emergency contact address must not exceed 500 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate address pattern (letters, numbers, spaces, basic punctuation)
      const address_pattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!address_pattern.test(this.emergency_contact_address)) {
        throw new EmployeeBusinessException(
          'Emergency contact address can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate birth date is not in the future
    if (this.birth_date > today) {
      throw new EmployeeBusinessException(
        'Birth date cannot be in the future.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate hire date is not before birth date
    if (this.hire_date < this.birth_date) {
      throw new EmployeeBusinessException(
        'Hire date cannot be before birth date.',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Validate end date if provided
    if (this.end_date) {
      if (!(this.end_date instanceof Date) || isNaN(this.end_date.getTime())) {
        throw new EmployeeBusinessException(
          'End date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.end_date < this.hire_date) {
        throw new EmployeeBusinessException(
          'End date cannot be before hire date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate regularization date if provided
    if (this.regularization_date) {
      if (
        !(this.regularization_date instanceof Date) ||
        isNaN(this.regularization_date.getTime())
      ) {
        throw new EmployeeBusinessException(
          'Regularization date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.regularization_date < this.hire_date) {
        throw new EmployeeBusinessException(
          'Regularization date cannot be before hire date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate family information if provided
    // Husband or wife name validation
    if (
      this.husband_or_wife_name !== undefined &&
      this.husband_or_wife_name !== null
    ) {
      if (this.husband_or_wife_name.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Husband or wife name cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.husband_or_wife_name.length > 255) {
        throw new EmployeeBusinessException(
          'Husband or wife name must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate name pattern (letters, spaces, hyphens, apostrophes, periods)
      const name_pattern = /^[a-zA-Z\s\-'.,]+$/;
      if (!name_pattern.test(this.husband_or_wife_name)) {
        throw new EmployeeBusinessException(
          'Husband or wife name can only contain letters, spaces, hyphens, apostrophes, and periods.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Husband or wife birth date validation
    if (
      this.husband_or_wife_birth_date !== undefined &&
      this.husband_or_wife_birth_date !== null
    ) {
      if (
        !(this.husband_or_wife_birth_date instanceof Date) ||
        isNaN(this.husband_or_wife_birth_date.getTime())
      ) {
        throw new EmployeeBusinessException(
          'Husband or wife birth date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate birth date is not in the future
      if (this.husband_or_wife_birth_date > today) {
        throw new EmployeeBusinessException(
          'Husband or wife birth date cannot be in the future.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Husband or wife occupation validation
    if (
      this.husband_or_wife_occupation !== undefined &&
      this.husband_or_wife_occupation !== null
    ) {
      if (this.husband_or_wife_occupation.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Husband or wife occupation cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.husband_or_wife_occupation.length > 255) {
        throw new EmployeeBusinessException(
          'Husband or wife occupation must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate occupation pattern (letters, numbers, spaces, basic punctuation)
      const occupation_pattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!occupation_pattern.test(this.husband_or_wife_occupation)) {
        throw new EmployeeBusinessException(
          'Husband or wife occupation can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Number of children validation
    if (
      this.number_of_children !== undefined &&
      this.number_of_children !== null
    ) {
      if (
        typeof this.number_of_children !== 'number' ||
        !isFinite(this.number_of_children)
      ) {
        throw new EmployeeBusinessException(
          'Number of children must be a valid number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.number_of_children < 0) {
        throw new EmployeeBusinessException(
          'Number of children cannot be negative.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.number_of_children > 50) {
        throw new EmployeeBusinessException(
          'Number of children must not exceed 50.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Must be an integer
      if (!Number.isInteger(this.number_of_children)) {
        throw new EmployeeBusinessException(
          'Number of children must be a whole number.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Father's name validation
    if (this.fathers_name !== undefined && this.fathers_name !== null) {
      if (this.fathers_name.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Fathers name cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.fathers_name.length > 255) {
        throw new EmployeeBusinessException(
          'Fathers name must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate name pattern (letters, spaces, hyphens, apostrophes, periods)
      const name_pattern = /^[a-zA-Z\s\-'.,]+$/;
      if (!name_pattern.test(this.fathers_name)) {
        throw new EmployeeBusinessException(
          'Fathers name can only contain letters, spaces, hyphens, apostrophes, and periods.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Father's birth date validation
    if (
      this.fathers_birth_date !== undefined &&
      this.fathers_birth_date !== null
    ) {
      if (
        !(this.fathers_birth_date instanceof Date) ||
        isNaN(this.fathers_birth_date.getTime())
      ) {
        throw new EmployeeBusinessException(
          'Fathers birth date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate birth date is not in the future
      if (this.fathers_birth_date > today) {
        throw new EmployeeBusinessException(
          'Fathers birth date cannot be in the future.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Father's occupation validation
    if (
      this.fathers_occupation !== undefined &&
      this.fathers_occupation !== null
    ) {
      if (this.fathers_occupation.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Fathers occupation cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.fathers_occupation.length > 255) {
        throw new EmployeeBusinessException(
          'Fathers occupation must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate occupation pattern (letters, numbers, spaces, basic punctuation)
      const occupation_pattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!occupation_pattern.test(this.fathers_occupation)) {
        throw new EmployeeBusinessException(
          'Fathers occupation can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Mother's name validation
    if (this.mothers_name !== undefined && this.mothers_name !== null) {
      if (this.mothers_name.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Mothers name cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.mothers_name.length > 255) {
        throw new EmployeeBusinessException(
          'Mothers name must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate name pattern (letters, spaces, hyphens, apostrophes, periods)
      const name_pattern = /^[a-zA-Z\s\-'.,]+$/;
      if (!name_pattern.test(this.mothers_name)) {
        throw new EmployeeBusinessException(
          'Mothers name can only contain letters, spaces, hyphens, apostrophes, and periods.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Mother's birth date validation
    if (
      this.mothers_birth_date !== undefined &&
      this.mothers_birth_date !== null
    ) {
      if (
        !(this.mothers_birth_date instanceof Date) ||
        isNaN(this.mothers_birth_date.getTime())
      ) {
        throw new EmployeeBusinessException(
          'Mothers birth date must be a valid date.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate birth date is not in the future
      if (this.mothers_birth_date > today) {
        throw new EmployeeBusinessException(
          'Mothers birth date cannot be in the future.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Mother's occupation validation
    if (
      this.mothers_occupation !== undefined &&
      this.mothers_occupation !== null
    ) {
      if (this.mothers_occupation.trim().length === 0) {
        throw new EmployeeBusinessException(
          'Mothers occupation cannot be empty if provided.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      if (this.mothers_occupation.length > 255) {
        throw new EmployeeBusinessException(
          'Mothers occupation must not exceed 255 characters.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }

      // Validate occupation pattern (letters, numbers, spaces, basic punctuation)
      const occupation_pattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
      if (!occupation_pattern.test(this.mothers_occupation)) {
        throw new EmployeeBusinessException(
          'Mothers occupation can only contain letters, numbers, spaces, and basic punctuation.',
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    // Validate bank details if any bank field is provided
    if (
      this.bank_account_number ||
      this.bank_account_name ||
      this.bank_name ||
      this.bank_branch
    ) {
      this.validateBankDetails();
    }

    // Validate salary details if any salary field is provided
    if (
      this.annual_salary !== undefined ||
      this.monthly_salary !== undefined ||
      this.daily_rate !== undefined ||
      this.hourly_rate !== undefined ||
      this.pay_type !== undefined
    ) {
      this.validateSalaryDetails();
    }

    // Validate government details if any government field is provided
    if (
      this.phic ||
      this.hdmf ||
      this.sss_no ||
      this.tin_no ||
      this.tax_exempt_code
    ) {
      this.validateGovernmentDetails();
    }
  }
}
