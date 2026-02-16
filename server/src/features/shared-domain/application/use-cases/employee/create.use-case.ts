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
import { CreateEmployeeCommand } from '../../commands/employee/create-employee.command';
import {
  BranchRepository,
  DepartmentRepository,
  JobtitleRepository,
  LeaveTypeRepository,
} from '@/features/shared-domain/domain/repositories';
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
export class CreateEmployeeUseCase {
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
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
  ) {}

  async execute(
    command: CreateEmployeeCommand,
    requestInfo?: RequestInfo,
  ): Promise<Employee> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.CREATE,
      async (manager) => {
        // Check for duplicate employees
        await this.validateUniqueEmployee(command, manager);

        // Validate all required entities by description (from UI combobox)
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
          leaveType,
          presentAddressBarangay,
          presentAddressCity,
          presentAddressProvince,
        ] = await Promise.all([
          this.validateBranchByDescription(command.branch, manager),
          this.validateCitizenshipByDescription(command.citizenship, manager),
          this.validateJobTitleByDescription(command.job_title, manager),
          this.validateEmploymentTypeByDescription(
            command.employment_type,
            manager,
          ),
          this.validateEmploymentStatusByDescription(
            command.employment_status,
            manager,
          ),
          this.validateReligionByDescription(command.religion, manager),
          this.validateCivilStatusByDescription(command.civil_status, manager),
          this.validateBarangayByDescription(
            command.home_address_barangay,
            manager,
          ),
          this.validateCityByDescription(command.home_address_city, manager),
          this.validateProvinceByDescription(
            command.home_address_province,
            manager,
          ),
          this.validateDepartmentByDescription(command.department, manager),
          command.leave_type
            ? this.validateLeaveTypeByDescription(command.leave_type, manager)
            : Promise.resolve(null),
          command.present_address_barangay
            ? this.validateBarangayByDescription(
                command.present_address_barangay,
                manager,
              )
            : Promise.resolve(null),
          command.present_address_city
            ? this.validateCityByDescription(
                command.present_address_city,
                manager,
              )
            : Promise.resolve(null),
          command.present_address_province
            ? this.validateProvinceByDescription(
                command.present_address_province,
                manager,
              )
            : Promise.resolve(null),
        ]);

        // Validate employment status and leave type
        if (
          employmentStatus.desc1?.toLowerCase().includes('on-leave') &&
          !leaveType
        ) {
          throw new EmployeeBusinessException(
            'Leave type is required when employment status is on-leave',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        // Create the employee using domain model factory method
        const new_employee = Employee.create({
          job_title_id: jobTitle.id!,
          employment_type_id: employmentType.id!,
          employment_status_id: employmentStatus.id!,
          leave_type_id: leaveType?.id ?? undefined,
          branch_id: branch.id!,
          department_id: department?.id || 0,
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
          citizen_ship_id: citizenship?.id || 0,
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
          emergency_contact_relationship:
            command.emergency_contact_relationship,
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
          is_active: command.is_active ?? true, // Default to true if not provided
          labor_classification: command.labor_classification,
          labor_classification_status: command.labor_classification_status,
          created_by: requestInfo?.user_name || null,
        });

        const created_employee = await this.employeeRepository.create(
          new_employee,
          manager,
        );

        if (!created_employee) {
          throw new EmployeeBusinessException(
            'Employee creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.CREATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id: created_employee.id,
            id_number: created_employee.id_number,
            first_name: created_employee.first_name,
            last_name: created_employee.last_name,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_employee.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_employee;
      },
    );
  }

  private async validateUniqueEmployee(
    dto: CreateEmployeeCommand,
    manager: EntityManager,
  ): Promise<void> {
    if (dto.id_number) {
      const existingByIdNumber = await this.employeeRepository.findByIdNumber(
        dto.id_number,
        manager,
      );
      if (existingByIdNumber) {
        throw new EmployeeBusinessException(
          `Employee with ID number ${dto.id_number} already exists`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }

    if (dto.bio_number) {
      const existingByBioNumber = await this.employeeRepository.findByBioNumber(
        dto.bio_number,
        manager,
      );
      if (existingByBioNumber) {
        throw new EmployeeBusinessException(
          `Employee with bio number ${dto.bio_number} already exists`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
    }
  }

  private async validateBranchByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const branch = await this.branchRepository.findByDescription(desc, manager);
    if (!branch) {
      throw new EmployeeBusinessException(
        `Branch "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return branch;
  }

  private async validateCitizenshipByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const citizenship = await this.citizenshipRepository.findByDescription(
      desc,
      manager,
    );
    if (!citizenship) {
      throw new EmployeeBusinessException(
        `Citizenship "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return citizenship;
  }

  private async validateJobTitleByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const jobTitle = await this.jobTitleRepository.findByDescription(
      desc,
      manager,
    );
    if (!jobTitle) {
      throw new EmployeeBusinessException(
        `Job title "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return jobTitle;
  }

  private async validateEmploymentTypeByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const employmentType =
      await this.employmentTypeRepository.findByDescription(desc, manager);
    if (!employmentType) {
      throw new EmployeeBusinessException(
        `Employment type "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return employmentType;
  }

  private async validateEmploymentStatusByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const employmentStatus =
      await this.employmentStatusRepository.findByDescription(desc, manager);
    if (!employmentStatus) {
      throw new EmployeeBusinessException(
        `Employment status "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return employmentStatus;
  }

  private async validateReligionByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const religion = await this.religionRepository.findByDescription(
      desc,
      manager,
    );
    if (!religion) {
      throw new EmployeeBusinessException(
        `Religion "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return religion;
  }

  private async validateCivilStatusByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const civilStatus = await this.civilStatusRepository.findByDescription(
      desc,
      manager,
    );
    if (!civilStatus) {
      throw new EmployeeBusinessException(
        `Civil status "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return civilStatus;
  }

  private async validateCityByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const city = await this.cityRepository.findByDescription(desc, manager);
    if (!city) {
      throw new EmployeeBusinessException(
        `City "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return city;
  }

  private async validateProvinceByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const province = await this.provinceRepository.findByDescription(
      desc,
      manager,
    );
    if (!province) {
      throw new EmployeeBusinessException(
        `Province "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return province;
  }

  private async validateDepartmentByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const department = await this.departmentRepository.findByDescription(
      desc,
      manager,
    );
    if (!department) {
      throw new EmployeeBusinessException(
        `Department "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return department;
  }

  private async validateBarangayByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const barangay = await this.barangayRepository.findByDescription(
      desc,
      manager,
    );
    if (!barangay) {
      throw new EmployeeBusinessException(
        `Barangay "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return barangay;
  }

  private async validateLeaveTypeByDescription(
    desc: string,
    manager: EntityManager,
  ) {
    const leaveType = await this.leaveTypeRepository.findByDescription(
      desc,
      manager,
    );
    if (!leaveType) {
      throw new EmployeeBusinessException(
        `Leave type "${desc}" not found`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return leaveType;
  }
}
