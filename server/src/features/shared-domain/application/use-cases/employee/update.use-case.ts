import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EntityManager } from 'typeorm';
import { EmployeeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Employee } from '@/features/shared-domain/domain/models';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateEmployeeCommand } from '../../commands/employee/update-employee.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import { JobtitleRepository } from '@/features/shared-domain/domain/repositories';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import { EmploymentStatusRepository } from '@/features/201-management/domain/repositories';
import { ReligionRepository } from '@/features/201-management/domain/repositories';
import { CivilStatusRepository } from '@/features/201-management/domain/repositories';
import { CitizenshipRepository } from '@/features/201-management/domain/repositories';
import { BarangayRepository } from '@/features/201-management/domain/repositories';
import { CityRepository } from '@/features/201-management/domain/repositories';
import { ProvinceRepository } from '@/features/201-management/domain/repositories';
import { MANAGEMENT_201_TOKENS } from '@/features/201-management/domain/constants';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobTitleRepository: JobtitleRepository,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(MANAGEMENT_201_TOKENS.PROVINCE)
    private readonly provinceRepository: ProvinceRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateEmployeeCommand,
    requestInfo?: RequestInfo,
  ): Promise<Employee | null> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.UPDATE,
      async (manager) => {
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new EmployeeBusinessException(
            'Employee not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Validate unique employee (id_number and bio_number)
        await this.validateUniqueEmployee(id, command, manager);

        // Validate all related entities in parallel
        const [
          branch,
          citizenship,
          jobTitle,
          employmentType,
          employmentStatus,
          religion,
          civilStatus,
          homeAddressBarangay,
          homeAddressCity,
          homeAddressProvince,
          department,
          presentAddressBarangay,
          presentAddressCity,
          presentAddressProvince,
        ] = await Promise.all([
          this.validateBranch(command.branch, manager),
          this.validateCitizenship(command.citizen_ship, manager),
          this.validateJobTitle(command.job_title, manager),
          this.validateEmploymentType(command.employment_type, manager),
          this.validateEmploymentStatus(command.employment_status, manager),
          this.validateReligion(command.religion, manager),
          this.validateCivilStatus(command.civil_status, manager),
          this.validateBarangay(command.home_address_barangay, manager),
          this.validateCity(command.home_address_city, manager),
          this.validateProvince(command.home_address_province, manager),
          this.validateDepartment(command.department, manager),
          command.present_address_barangay
            ? this.validateBarangay(command.present_address_barangay, manager)
            : Promise.resolve(null),
          command.present_address_city
            ? this.validateCity(command.present_address_city, manager)
            : Promise.resolve(null),
          command.present_address_province
            ? this.validateProvince(command.present_address_province, manager)
            : Promise.resolve(null),
        ]);

        // Validate employment status and leave type requirement
        if (
          employmentStatus.desc1?.toLowerCase().includes('on-leave') &&
          !command.leave_type
        ) {
          throw new EmployeeBusinessException(
            'Leave type is required when employment status is on-leave',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'id_number' },
          { field: 'bio_number' },
          { field: 'first_name' },
          { field: 'middle_name' },
          { field: 'last_name' },
          { field: 'suffix' },
          {
            field: 'birth_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'age' },
          { field: 'gender' },
          { field: 'email' },
          { field: 'cellphone_number' },
          { field: 'telephone_number' },
          { field: 'image_path' },
          { field: 'job_title_id' },
          { field: 'employment_type_id' },
          { field: 'employment_status_id' },
          { field: 'leave_type_id' },
          { field: 'branch_id' },
          { field: 'department_id' },
          {
            field: 'hire_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'religion_id' },
          { field: 'civil_status_id' },
          { field: 'citizen_ship_id' },
          { field: 'height' },
          { field: 'weight' },
          { field: 'home_address_street' },
          { field: 'home_address_barangay_id' },
          { field: 'home_address_city_id' },
          { field: 'home_address_province_id' },
          { field: 'home_address_zip_code' },
          { field: 'present_address_street' },
          { field: 'present_address_barangay_id' },
          { field: 'present_address_city_id' },
          { field: 'present_address_province_id' },
          { field: 'present_address_zip_code' },
          { field: 'emergency_contact_name' },
          { field: 'emergency_contact_number' },
          { field: 'emergency_contact_relationship' },
          { field: 'emergency_contact_address' },
          { field: 'husband_or_wife_name' },
          {
            field: 'husband_or_wife_birth_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'husband_or_wife_occupation' },
          { field: 'number_of_children' },
          { field: 'fathers_name' },
          {
            field: 'fathers_birth_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'fathers_occupation' },
          { field: 'mothers_name' },
          {
            field: 'mothers_birth_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'mothers_occupation' },
          { field: 'is_active' },
          { field: 'labor_classification' },
          { field: 'labor_classification_status' },
          { field: 'remarks' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(employee, tracking_config);

        // Update employee with validated IDs
        employee.update({
          job_title_id: jobTitle.id!,
          employment_type_id: employmentType.id!,
          employment_status_id: employmentStatus.id!,
          leave_type_id: undefined, // TODO: Need LeaveTypeRepository to validate leave_type if provided
          branch_id: branch.id!,
          department_id: department.id!,
          hire_date: command.hire_date,
          id_number: command.id_number,
          bio_number: command.bio_number,
          image_path: command.image_path,
          first_name: command.first_name,
          middle_name: command.middle_name,
          last_name: command.last_name,
          suffix: command.suffix,
          birth_date: command.birth_date,
          religion_id: religion.id!,
          civil_status_id: civilStatus.id!,
          age: command.age,
          gender: command.gender,
          citizen_ship_id: citizenship.id!,
          height: command.height,
          weight: command.weight,
          home_address_street: command.home_address_street,
          home_address_barangay_id: homeAddressBarangay.id!,
          home_address_city_id: homeAddressCity.id!,
          home_address_province_id: homeAddressProvince.id!,
          home_address_zip_code: command.home_address_zip_code,
          present_address_street: command.present_address_street,
          present_address_barangay_id: presentAddressBarangay?.id,
          present_address_city_id: presentAddressCity?.id,
          present_address_province_id: presentAddressProvince?.id,
          present_address_zip_code: command.present_address_zip_code,
          cellphone_number: command.cellphone_number,
          telephone_number: command.telephone_number,
          email: command.email,
          emergency_contact_name: command.emergency_contact_name,
          emergency_contact_number: command.emergency_contact_number,
          emergency_contact_relationship: command.emergency_contact_relationship,
          emergency_contact_address: command.emergency_contact_address,
          husband_or_wife_name: command.husband_or_wife_name,
          husband_or_wife_birth_date: command.husband_or_wife_birth_date,
          husband_or_wife_occupation: command.husband_or_wife_occupation,
          number_of_children: command.number_of_children,
          fathers_name: command.fathers_name,
          fathers_birth_date: command.fathers_birth_date,
          fathers_occupation: command.fathers_occupation,
          mothers_name: command.mothers_name,
          mothers_birth_date: command.mothers_birth_date,
          mothers_occupation: command.mothers_occupation,
          remarks: command.remarks,
          is_active: command.is_active,
          labor_classification: command.labor_classification,
          labor_classification_status: command.labor_classification_status,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.employeeRepository.update(
          id,
          employee,
          manager,
        );
        if (!success) {
          throw new EmployeeBusinessException(
            'Employee update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.employeeRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }

  private async validateUniqueEmployee(
    currentEmployeeId: number,
    command: UpdateEmployeeCommand,
    manager: EntityManager,
  ): Promise<void> {
    if (command.id_number) {
      const existingByIdNumber =
        await this.employeeRepository.findByIdNumber(
          command.id_number,
          manager,
        );
      if (existingByIdNumber && existingByIdNumber.id !== currentEmployeeId) {
        throw new EmployeeBusinessException(
          `Employee with ID number ${command.id_number} already exists`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (command.bio_number) {
      const existingByBioNumber =
        await this.employeeRepository.findByBioNumber(
          command.bio_number,
          manager,
        );
      if (existingByBioNumber && existingByBioNumber.id !== currentEmployeeId) {
        throw new EmployeeBusinessException(
          `Employee with bio number ${command.bio_number} already exists`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }

  private async validateBranch(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const branch = await this.branchRepository.findByDescription(description, manager);
    if (!branch) {
      throw new EmployeeBusinessException(
        `Branch '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return branch;
  }

  private async validateCitizenship(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const citizenship = await this.citizenshipRepository.findByDescription(description, manager);
    if (!citizenship) {
      throw new EmployeeBusinessException(
        `Citizenship '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return citizenship;
  }

  private async validateJobTitle(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const jobTitle = await this.jobTitleRepository.findByDescription(description, manager);
    if (!jobTitle) {
      throw new EmployeeBusinessException(
        `Job title '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return jobTitle;
  }

  private async validateEmploymentType(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const employmentType =
      await this.employmentTypeRepository.findByDescription(description, manager);
    if (!employmentType) {
      throw new EmployeeBusinessException(
        `Employment type '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return employmentType;
  }

  private async validateEmploymentStatus(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const employmentStatus =
      await this.employmentStatusRepository.findByDescription(description, manager);
    if (!employmentStatus) {
      throw new EmployeeBusinessException(
        `Employment status '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return employmentStatus;
  }

  private async validateReligion(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const religion = await this.religionRepository.findByDescription(description, manager);
    if (!religion) {
      throw new EmployeeBusinessException(
        `Religion '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return religion;
  }

  private async validateCivilStatus(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const civilStatus =
      await this.civilStatusRepository.findByDescription(description, manager);
    if (!civilStatus) {
      throw new EmployeeBusinessException(
        `Civil status '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return civilStatus;
  }

  private async validateCity(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const city = await this.cityRepository.findByDescription(description, manager);
    if (!city) {
      throw new EmployeeBusinessException(
        `City '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return city;
  }

  private async validateProvince(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const province = await this.provinceRepository.findByDescription(description, manager);
    if (!province) {
      throw new EmployeeBusinessException(
        `Province '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return province;
  }

  private async validateDepartment(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const department = await this.departmentRepository.findByDescription(description, manager);
    if (!department) {
      throw new EmployeeBusinessException(
        `Department '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return department;
  }

  private async validateBarangay(
    description: string,
    manager: EntityManager,
  ): Promise<any> {
    const barangay = await this.barangayRepository.findByDescription(description, manager);
    if (!barangay) {
      throw new EmployeeBusinessException(
        `Barangay '${description}' not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return barangay;
  }
}
