import { PaginatedResult } from '@shared/interfaces';
import { Employee } from '@core/domain/models';

export interface EmployeeRepository<Context = unknown> {
  create(employee: Employee, context: Context): Promise<Employee>;
  update(
    id: number,
    dto: Partial<Employee>,
    context: Context,
  ): Promise<boolean>;
  findById(id: number, context: Context): Promise<Employee | null>;
  findByIdNumber(id_number: string, context: Context): Promise<Employee | null>;
  findByBioNumber(
    bio_number: string,
    context: Context,
  ): Promise<Employee | null>;
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Employee>>;
  updateImagePath(
    employee_id: number,
    image_path: string,
    context: Context,
  ): Promise<boolean>;
  updateGovernmentDetails(
    employee_id: number,
    government_details: Partial<Employee>,
    context: Context,
  ): Promise<boolean>;
  updateSalaryDetails(
    employee_id: number,
    salary_details: Partial<Employee>,
    context: Context,
  ): Promise<boolean>;
  updateBankDetails(
    employee_id: number,
    bank_details: Partial<Employee>,
    context: Context,
  ): Promise<boolean>;
  retrieveActiveEmployees(context: Context): Promise<Employee[]>;
  findEmployeesEligibleForLeave(
    employment_type_names: string[],
    employment_status_names: string[],
    context: Context,
  ): Promise<Employee[]>;
}
