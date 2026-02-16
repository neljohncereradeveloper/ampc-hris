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
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
  ) {}

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

        // Validate related entities by description when provided (from UI combobox)
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
          command.branch != null
            ? this.validateBranchByDescription(command.branch, manager)
            : Promise.resolve(null),
          command.citizenship != null
            ? this.validateCitizenshipByDescription(
                command.citizenship,
                manager,
              )
            : Promise.resolve(null),
          command.job_title != null
            ? this.validateJobTitleByDescription(command.job_title, manager)
            : Promise.resolve(null),
          command.employment_type != null
            ? this.validateEmploymentTypeByDescription(
                command.employment_type,
                manager,
              )
            : Promise.resolve(null),
          command.employment_status != null
            ? this.validateEmploymentStatusByDescription(
                command.employment_status,
                manager,
              )
            : Promise.resolve(null),
          command.religion != null
            ? this.validateReligionByDescription(command.religion, manager)
            : Promise.resolve(null),
          command.civil_status != null
            ? this.validateCivilStatusByDescription(
                command.civil_status,
                manager,
              )
            : Promise.resolve(null),
          command.home_address_barangay != null
            ? this.validateBarangayByDescription(
                command.home_address_barangay,
                manager,
              )
            : Promise.resolve(null),
          command.home_address_city != null
            ? this.validateCityByDescription(command.home_address_city, manager)
            : Promise.resolve(null),
          command.home_address_province != null
            ? this.validateProvinceByDescription(
                command.home_address_province,
                manager,
              )
            : Promise.resolve(null),
          command.department != null
            ? this.validateDepartmentByDescription(command.department, manager)
            : Promise.resolve(null),
          command.leave_type != null
            ? this.validateLeaveTypeByDescription(command.leave_type, manager)
            : Promise.resolve(null),
          command.present_address_barangay != null
            ? this.validateBarangayByDescription(
                command.present_address_barangay,
                manager,
              )
            : Promise.resolve(null),
          command.present_address_city != null
            ? this.validateCityByDescription(
                command.present_address_city,
                manager,
              )
            : Promise.resolve(null),
          command.present_address_province != null
            ? this.validateProvinceByDescription(
                command.present_address_province,
                manager,
              )
            : Promise.resolve(null),
        ]);

        // Validate employment status and leave type requirement
        const effectiveEmploymentStatus =
          employmentStatus ??
          (employee.employment_status
            ? { desc1: employee.employment_status }
            : null);
        if (
          effectiveEmploymentStatus?.desc1
            ?.toLowerCase()
            .includes('on-leave') &&
          !(leaveType?.id ?? employee.leave_type_id)
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

        // Merge command with existing employee (only update provided fields)
        employee.update({
          job_title_id: jobTitle?.id ?? employee.job_title_id,
          employment_type_id: employmentType?.id ?? employee.employment_type_id,
          employment_status_id:
            employmentStatus?.id ?? employee.employment_status_id,
          leave_type_id: leaveType?.id ?? employee.leave_type_id,
          branch_id: branch?.id ?? employee.branch_id,
          department_id: department?.id ?? employee.department_id,
          hire_date: command.hire_date ?? employee.hire_date,
          end_date: command.end_date ?? employee.end_date,
          regularization_date:
            command.regularization_date ?? employee.regularization_date,
          id_number: command.id_number ?? employee.id_number,
          bio_number: command.bio_number ?? employee.bio_number,
          image_path: command.image_path ?? employee.image_path,
          first_name: command.first_name ?? employee.first_name,
          middle_name: command.middle_name ?? employee.middle_name,
          last_name: command.last_name ?? employee.last_name,
          suffix: command.suffix ?? employee.suffix,
          birth_date: command.birth_date ?? employee.birth_date,
          religion_id: religion?.id ?? employee.religion_id,
          civil_status_id: civilStatus?.id ?? employee.civil_status_id,
          age: command.age ?? employee.age,
          gender: command.gender ?? employee.gender,
          citizen_ship_id: citizenship?.id ?? employee.citizen_ship_id,
          height: command.height ?? employee.height,
          weight: command.weight ?? employee.weight,
          home_address_street:
            command.home_address_street ?? employee.home_address_street,
          home_address_barangay_id:
            homeAddressBarangay?.id ?? employee.home_address_barangay_id,
          home_address_city_id:
            homeAddressCity?.id ?? employee.home_address_city_id,
          home_address_province_id:
            homeAddressProvince?.id ?? employee.home_address_province_id,
          home_address_zip_code:
            command.home_address_zip_code ?? employee.home_address_zip_code,
          present_address_street:
            command.present_address_street ?? employee.present_address_street,
          present_address_barangay_id:
            presentAddressBarangay?.id ?? employee.present_address_barangay_id,
          present_address_city_id:
            presentAddressCity?.id ?? employee.present_address_city_id,
          present_address_province_id:
            presentAddressProvince?.id ?? employee.present_address_province_id,
          present_address_zip_code:
            command.present_address_zip_code ??
            employee.present_address_zip_code,
          cellphone_number:
            command.cellphone_number ?? employee.cellphone_number,
          telephone_number:
            command.telephone_number ?? employee.telephone_number,
          email: command.email ?? employee.email,
          emergency_contact_name:
            command.emergency_contact_name ?? employee.emergency_contact_name,
          emergency_contact_number:
            command.emergency_contact_number ??
            employee.emergency_contact_number,
          emergency_contact_relationship:
            command.emergency_contact_relationship ??
            employee.emergency_contact_relationship,
          emergency_contact_address:
            command.emergency_contact_address ??
            employee.emergency_contact_address,
          husband_or_wife_name:
            command.husband_or_wife_name ?? employee.husband_or_wife_name,
          husband_or_wife_birth_date:
            command.husband_or_wife_birth_date ??
            employee.husband_or_wife_birth_date,
          husband_or_wife_occupation:
            command.husband_or_wife_occupation ??
            employee.husband_or_wife_occupation,
          number_of_children:
            command.number_of_children ?? employee.number_of_children,
          fathers_name: command.fathers_name ?? employee.fathers_name,
          fathers_birth_date:
            command.fathers_birth_date ?? employee.fathers_birth_date,
          fathers_occupation:
            command.fathers_occupation ?? employee.fathers_occupation,
          mothers_name: command.mothers_name ?? employee.mothers_name,
          mothers_birth_date:
            command.mothers_birth_date ?? employee.mothers_birth_date,
          mothers_occupation:
            command.mothers_occupation ?? employee.mothers_occupation,
          remarks: command.remarks ?? employee.remarks,
          is_active: command.is_active ?? employee.is_active,
          labor_classification:
            command.labor_classification ?? employee.labor_classification,
          labor_classification_status:
            command.labor_classification_status ??
            employee.labor_classification_status,
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
      const existingByIdNumber = await this.employeeRepository.findByIdNumber(
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
      const existingByBioNumber = await this.employeeRepository.findByBioNumber(
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
