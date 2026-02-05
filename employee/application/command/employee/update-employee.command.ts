import { GenderEnum, PaymentTypeEnum } from '@core/domain/enum';
import { LaborClassificationEnum } from '@core/domain/enum/employee/labor-classification.enum';
import { LaborClassificationStatusEnum } from '@core/domain/enum/employee/labor-classification.status.enum';

export interface UpdateEmployeeCommand {
  /** employment information */
  job_title: string;
  employment_type: string;
  employment_status: string;
  leave_type?: string;
  branch: string;
  department: string;
  hire_date: Date;
  id_number: string;
  bio_number?: string;
  image_path?: string;

  /** personal information */
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  birth_date: Date;
  religion: string;
  civil_status: string;
  age?: number;
  gender?: GenderEnum;
  citizen_ship: string;
  height?: number;
  weight?: number;

  /** address information */
  home_address_street: string;
  home_address_barangay: string;
  home_address_city: string;
  home_address_province: string;
  home_address_zip_code: string;
  present_address_street?: string;
  present_address_barangay?: string;
  present_address_city?: string;
  present_address_province?: string;
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
}
