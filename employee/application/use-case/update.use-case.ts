import { TransactionPort } from '@core/ports';
import { Employee } from '@core/domain/models/employee.model';
import {
  JobTitleRepository,
  DepartmentRepository,
  BranchRepository,
  EmployeeRepository,
  ActivityLogRepository,
} from '@core/domain/repositories';
import {
  EmploymentTypeRepository,
  EmploymentStatusRepository,
  ReligionRepository,
  CivilStatusRepository,
  CityRepository,
  ProvinceRepository,
  CitizenShipRepository,
  BarangayRepository,
} from '@features/201-files/domain/repositories';
import { LeaveTypeRepository } from '@features/leave-management/domain/repositories';
import { Inject, Injectable } from '@nestjs/common';
import {
  CONSTANTS_DATABASE_MODELS,
  CONSTANTS_REPOSITORY_TOKENS,
} from '@shared/constants';
import { UpdateEmployeeCommand } from '../../commands/employee/update-employee.command';
import { RequestInfo } from '@shared/interfaces';
import {
  SomethinWentWrongException,
  NotFoundException,
} from '@core/exceptions/shared';
import { ActivityLog } from '@core/domain/models';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@shared/utils/change-tracking.util';
import { getPHDateTime } from '@shared/utils';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.JOB_TITLE)
    private readonly jobTitleRepository: JobTitleRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.CITY)
    private readonly addressCityRepository: CityRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.PROVINCE)
    private readonly addressProvinceRepository: ProvinceRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenShipRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
  ) {}

  async execute(
    id: number,
    dto: UpdateEmployeeCommand,
    requestInfo?: RequestInfo,
  ): Promise<Employee | null> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.UPDATE,
      async (manager) => {
        // Validate employee existence
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        // Check for duplicate employees (excluding current employee)
        await this.validateUniqueEmployee(id, dto, manager);

        // Validate employment status and leave type
        if (dto.employment_status?.toLowerCase().includes('on-leave') && !dto.leave_type) {
          throw new NotFoundException(
            'Leave type is required when employment status is on-leave',
          );
        }

        // Validate all required entities in parallel
        const [
          branch,
          citizenShip,
          jobTitle,
          employmentType,
          employmentStatus,
          leaveType,
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
          this.validateBranch(dto.branch, manager),
          this.validateCitizenship(dto.citizen_ship, manager),
          this.validateJobTitle(dto.job_title, manager),
          this.validateEmploymentType(dto.employment_type, manager),
          this.validateEmploymentStatus(dto.employment_status, manager),
          dto.leave_type
            ? this.validateLeaveType(dto.leave_type, manager)
            : Promise.resolve(null),
          this.validateReligion(dto.religion, manager),
          this.validateCivilStatus(dto.civil_status, manager),
          this.validateBarangay(dto.home_address_barangay, manager),
          this.validateCity(dto.home_address_city, manager),
          this.validateProvince(dto.home_address_province, manager),
          this.validateDepartment(dto.department, manager),
          dto.present_address_barangay
            ? this.validateBarangay(dto.present_address_barangay, manager)
            : Promise.resolve(null),
          dto.present_address_city
            ? this.validateCity(dto.present_address_city, manager)
            : Promise.resolve(null),
          dto.present_address_province
            ? this.validateProvince(dto.present_address_province, manager)
            : Promise.resolve(null),
        ]);

        // Define fields to track for change logging
        const tracking_config: FieldExtractorConfig[] = [
          { field: 'id' },
          { field: 'id_number' },
          { field: 'bio_number' },
          { field: 'first_name' },
          { field: 'middle_name' },
          { field: 'last_name' },
          { field: 'suffix' },
          { field: 'email' },
          { field: 'cellphone_number' },
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
          {
            field: 'birth_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'religion_id' },
          { field: 'civil_status_id' },
          { field: 'citizen_ship_id' },
          { field: 'home_address_street' },
          { field: 'home_address_barangay_id' },
          { field: 'home_address_city_id' },
          { field: 'home_address_province_id' },
          { field: 'home_address_zip_code' },
          { field: 'remarks' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        // Capture before state for logging
        const before_state = extractEntityState(employee, tracking_config);

        // Use domain model method to update (encapsulates business logic and validation)
        employee.update({
          job_title_id: jobTitle.id!,
          employment_type_id: employmentType.id!,
          employment_status_id: employmentStatus.id!,
          leave_type_id: leaveType?.id,
          branch_id: branch.id!,
          department_id: department?.id || 0,
          hire_date: dto.hire_date,
          id_number: dto.id_number,
          bio_number: dto.bio_number,
          image_path: dto.image_path,
          first_name: dto.first_name,
          middle_name: dto.middle_name,
          last_name: dto.last_name,
          suffix: dto.suffix,
          birth_date: dto.birth_date,
          religion_id: religion.id!,
          civil_status_id: civilStatus.id!,
          age: dto.age,
          gender: dto.gender,
          citizen_ship_id: citizenShip?.id || 0,
          height: dto.height,
          weight: dto.weight,
          home_address_street: dto.home_address_street,
          home_address_barangay_id: homeAddressBarangay.id!,
          home_address_city_id: homeAddressCity.id!,
          home_address_province_id: homeAddressProvince.id!,
          home_address_zip_code: dto.home_address_zip_code,
          present_address_street: dto.present_address_street,
          present_address_barangay_id: presentAddressBarangay?.id,
          present_address_city_id: presentAddressCity?.id,
          present_address_province_id: presentAddressProvince?.id,
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
          is_active: dto.is_active,
          updated_by: requestInfo?.user_name || '',
        });

        // Update the employee in the database
        const success = await this.employeeRepository.update(
          id,
          employee,
          manager,
        );
        if (!success) {
          throw new SomethinWentWrongException('Employee update failed');
        }

        // Retrieve the updated employee
        const updated_result = await this.employeeRepository.findById(
          id,
          manager,
        );

        // Capture after state for logging
        const after_state = extractEntityState(updated_result, tracking_config);

        // Get only the changed fields with old and new states
        const changed_fields = getChangedFields(before_state, after_state);

        // Log the update with only changed fields (old state and new state)
        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.UPDATE,
          entity: CONSTANTS_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            employee_id: updated_result?.id,
            employee_name: `${updated_result?.first_name} ${updated_result?.last_name}`,
            id_number: updated_result?.id_number,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          employee_id: updated_result?.id,
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result!;
      },
    );
  }

  private async validateUniqueEmployee(
    currentEmployeeId: number,
    dto: UpdateEmployeeCommand,
    manager: any,
  ): Promise<void> {
    if (dto.id_number) {
      const existingByIdNumber = await this.employeeRepository.findByIdNumber(
        dto.id_number,
        manager,
      );
      if (existingByIdNumber && existingByIdNumber.id !== currentEmployeeId) {
        throw new NotFoundException(
          `Employee with ID number ${dto.id_number} already exists`,
        );
      }
    }

    if (dto.bio_number) {
      const existingByBioNumber = await this.employeeRepository.findByBioNumber(
        dto.bio_number,
        manager,
      );
      if (existingByBioNumber && existingByBioNumber.id !== currentEmployeeId) {
        throw new NotFoundException(
          `Employee with bio number ${dto.bio_number} already exists`,
        );
      }
    }
  }

  private async validateBranch(description: string, manager: any) {
    const branch = await this.branchRepository.findByDescription(
      description,
      manager,
    );
    if (!branch) {
      throw new NotFoundException(`Branch '${description}' not found`);
    }
    return branch;
  }

  private async validateCitizenship(description: string, manager: any) {
    const citizenship = await this.citizenshipRepository.findByDescription(
      description,
      manager,
    );
    if (!citizenship) {
      throw new NotFoundException(`Citizenship '${description}' not found`);
    }
    return citizenship;
  }

  private async validateJobTitle(description: string, manager: any) {
    const jobTitle = await this.jobTitleRepository.findByDescription(
      description,
      manager,
    );
    if (!jobTitle) {
      throw new NotFoundException(`Job title '${description}' not found`);
    }
    return jobTitle;
  }

  private async validateEmploymentType(description: string, manager: any) {
    const employmentType =
      await this.employmentTypeRepository.findByDescription(
        description,
        manager,
      );
    if (!employmentType) {
      throw new NotFoundException(`Employment type '${description}' not found`);
    }
    return employmentType;
  }

  private async validateEmploymentStatus(description: string, manager: any) {
    const employmentStatus =
      await this.employmentStatusRepository.findByDescription(
        description,
        manager,
      );
    if (!employmentStatus) {
      throw new NotFoundException(`Employment status '${description}' not found`);
    }
    return employmentStatus;
  }

  private async validateLeaveType(name: string, manager: any) {
    const leaveType = await this.leaveTypeRepository.findByName(
      name,
      manager,
    );
    if (!leaveType) {
      throw new NotFoundException(`Leave type '${name}' not found`);
    }
    return leaveType;
  }

  private async validateReligion(description: string, manager: any) {
    const religion = await this.religionRepository.findByDescription(
      description,
      manager,
    );
    if (!religion) {
      throw new NotFoundException(`Religion '${description}' not found`);
    }
    return religion;
  }

  private async validateCivilStatus(description: string, manager: any) {
    const civilStatus = await this.civilStatusRepository.findByDescription(
      description,
      manager,
    );
    if (!civilStatus) {
      throw new NotFoundException(`Civil status '${description}' not found`);
    }
    return civilStatus;
  }

  private async validateCity(description: string, manager: any) {
    const city = await this.addressCityRepository.findByDescription(
      description,
      manager,
    );
    if (!city) {
      throw new NotFoundException(`City '${description}' not found`);
    }
    return city;
  }

  private async validateProvince(description: string, manager: any) {
    const province = await this.addressProvinceRepository.findByDescription(
      description,
      manager,
    );
    if (!province) {
      throw new NotFoundException(`Province '${description}' not found`);
    }
    return province;
  }

  private async validateDepartment(description: string, manager: any) {
    const department = await this.departmentRepository.findByDescription(
      description,
      manager,
    );
    if (!department) {
      throw new NotFoundException(`Department '${description}' not found`);
    }
    return department;
  }

  private async validateBarangay(description: string, manager: any) {
    const barangay = await this.barangayRepository.findByDescription(
      description,
      manager,
    );
    if (!barangay) {
      throw new NotFoundException(`Barangay '${description}' not found`);
    }
    return barangay;
  }
}
