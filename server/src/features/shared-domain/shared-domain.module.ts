import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { Management201Module } from '@/features/201-management/management-201.module';
import { SHARED_DOMAIN_TOKENS } from './domain/constants';
import { BranchRepositoryImpl } from './infrastructure/database/repositories/branch.repository.impl';
import { DepartmentRepositoryImpl } from './infrastructure/database/repositories/department.repository.impl';
import { JobtitleRepositoryImpl } from './infrastructure/database/repositories/jobtitle.repository.impl';
import { HolidayRepositoryImpl } from './infrastructure/database/repositories/holiday.repository.impl';
import { EmployeeRepositoryImpl } from './infrastructure/database/repositories/employee.repository.impl';
import { LeaveTypeRepositoryImpl } from './infrastructure/database/repositories/leave-type.repository.impl';
import {
  CreateBranchUseCase,
  UpdateBranchUseCase,
  ArchiveBranchUseCase,
  RestoreBranchUseCase,
  GetPaginatedBranchUseCase,
  ComboboxBranchUseCase,
} from './application/use-cases/branch';
import {
  CreateDepartmentUseCase,
  UpdateDepartmentUseCase,
  ArchiveDepartmentUseCase,
  RestoreDepartmentUseCase,
  GetPaginatedDepartmentUseCase,
  ComboboxDepartmentUseCase,
} from './application/use-cases/department';
import {
  CreateJobtitleUseCase,
  UpdateJobtitleUseCase,
  ArchiveJobtitleUseCase,
  RestoreJobtitleUseCase,
  GetPaginatedJobtitleUseCase,
  ComboboxJobtitleUseCase,
} from './application/use-cases/jobtitle';
import {
  CreateLeaveTypeUseCase,
  UpdateLeaveTypeUseCase,
  ArchiveLeaveTypeUseCase,
  RestoreLeaveTypeUseCase,
  GetPaginatedLeaveTypeUseCase,
  ComboboxLeaveTypeUseCase,
} from './application/use-cases/leave-type';
import {
  CreateHolidayUseCase,
  UpdateHolidayUseCase,
  ArchiveHolidayUseCase,
  RestoreHolidayUseCase,
  GetPaginatedHolidayUseCase,
  ComboboxHolidayUseCase,
} from './application/use-cases/holiday';
import {
  CreateEmployeeUseCase,
  UpdateEmployeeUseCase,
  ArchiveEmployeeUseCase,
  RestoreEmployeeUseCase,
  GetPaginatedEmployeeUseCase,
  UpdateImagePathEmployeeUseCase,
  UpdateGovernmentDetailsEmployeeUseCase,
  UpdateSalaryDetailsEmployeeUseCase,
  UpdateBankDetailsEmployeeUseCase,
  FindByIdNumberEmployeeUseCase,
  FindByBioNumberEmployeeUseCase,
  RetrieveActiveEmployeesUseCase,
  FindEmployeesEligibleForLeaveUseCase,
} from './application/use-cases/employee';
import { BranchController } from './presentation/controllers/branch.controller';
import { DepartmentController } from './presentation/controllers/department.controller';
import { JobtitleController } from './presentation/controllers/jobtitle.controller';
import { LeaveTypeController } from './presentation/controllers/leave-type.controller';
import { HolidayController } from './presentation/controllers/holiday.controller';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';

@Module({
  imports: [PostgresqlDatabaseModule, Management201Module],
  controllers: [
    BranchController,
    DepartmentController,
    JobtitleController,
    LeaveTypeController,
    HolidayController,
    EmployeeController,
  ],
  providers: [
    // Repository implementations
    {
      provide: SHARED_DOMAIN_TOKENS.BRANCH,
      useClass: BranchRepositoryImpl,
    },
    {
      provide: SHARED_DOMAIN_TOKENS.DEPARTMENT,
      useClass: DepartmentRepositoryImpl,
    },
    {
      provide: SHARED_DOMAIN_TOKENS.JOBTITLE,
      useClass: JobtitleRepositoryImpl,
    },
    {
      provide: SHARED_DOMAIN_TOKENS.HOLIDAY,
      useClass: HolidayRepositoryImpl,
    },
    {
      provide: SHARED_DOMAIN_TOKENS.EMPLOYEE,
      useClass: EmployeeRepositoryImpl,
    },
    {
      provide: SHARED_DOMAIN_TOKENS.LEAVE_TYPE,
      useClass: LeaveTypeRepositoryImpl,
    },
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    // Branch use cases (no get-by-id)
    CreateBranchUseCase,
    UpdateBranchUseCase,
    ArchiveBranchUseCase,
    RestoreBranchUseCase,
    GetPaginatedBranchUseCase,
    ComboboxBranchUseCase,
    // Department use cases (no get-by-id)
    CreateDepartmentUseCase,
    UpdateDepartmentUseCase,
    ArchiveDepartmentUseCase,
    RestoreDepartmentUseCase,
    GetPaginatedDepartmentUseCase,
    ComboboxDepartmentUseCase,
    // Jobtitle use cases (no get-by-id)
    CreateJobtitleUseCase,
    UpdateJobtitleUseCase,
    ArchiveJobtitleUseCase,
    RestoreJobtitleUseCase,
    GetPaginatedJobtitleUseCase,
    ComboboxJobtitleUseCase,
    // Leave type use cases (no get-by-id)
    CreateLeaveTypeUseCase,
    UpdateLeaveTypeUseCase,
    ArchiveLeaveTypeUseCase,
    RestoreLeaveTypeUseCase,
    GetPaginatedLeaveTypeUseCase,
    ComboboxLeaveTypeUseCase,
    // Holiday use cases (no get-by-id)
    CreateHolidayUseCase,
    UpdateHolidayUseCase,
    ArchiveHolidayUseCase,
    RestoreHolidayUseCase,
    GetPaginatedHolidayUseCase,
    ComboboxHolidayUseCase,
    // Employee use cases (no get-by-id)
    CreateEmployeeUseCase,
    UpdateEmployeeUseCase,
    ArchiveEmployeeUseCase,
    RestoreEmployeeUseCase,
    GetPaginatedEmployeeUseCase,
    UpdateImagePathEmployeeUseCase,
    UpdateGovernmentDetailsEmployeeUseCase,
    UpdateSalaryDetailsEmployeeUseCase,
    UpdateBankDetailsEmployeeUseCase,
    FindByIdNumberEmployeeUseCase,
    FindByBioNumberEmployeeUseCase,
    RetrieveActiveEmployeesUseCase,
    FindEmployeesEligibleForLeaveUseCase,
  ],
  exports: [
    // Branch use cases (no get-by-id)
    CreateBranchUseCase,
    UpdateBranchUseCase,
    ArchiveBranchUseCase,
    RestoreBranchUseCase,
    GetPaginatedBranchUseCase,
    ComboboxBranchUseCase,
    // Department use cases (no get-by-id)
    CreateDepartmentUseCase,
    UpdateDepartmentUseCase,
    ArchiveDepartmentUseCase,
    RestoreDepartmentUseCase,
    GetPaginatedDepartmentUseCase,
    ComboboxDepartmentUseCase,
    // Jobtitle use cases (no get-by-id)
    CreateJobtitleUseCase,
    UpdateJobtitleUseCase,
    ArchiveJobtitleUseCase,
    RestoreJobtitleUseCase,
    GetPaginatedJobtitleUseCase,
    ComboboxJobtitleUseCase,
    // Leave type use cases (no get-by-id)
    CreateLeaveTypeUseCase,
    UpdateLeaveTypeUseCase,
    ArchiveLeaveTypeUseCase,
    RestoreLeaveTypeUseCase,
    GetPaginatedLeaveTypeUseCase,
    ComboboxLeaveTypeUseCase,
    // Holiday use cases (no get-by-id)
    CreateHolidayUseCase,
    UpdateHolidayUseCase,
    ArchiveHolidayUseCase,
    RestoreHolidayUseCase,
    GetPaginatedHolidayUseCase,
    ComboboxHolidayUseCase,
    // Employee use cases (no get-by-id)
    CreateEmployeeUseCase,
    UpdateEmployeeUseCase,
    ArchiveEmployeeUseCase,
    RestoreEmployeeUseCase,
    GetPaginatedEmployeeUseCase,
    UpdateImagePathEmployeeUseCase,
    UpdateGovernmentDetailsEmployeeUseCase,
    UpdateSalaryDetailsEmployeeUseCase,
    UpdateBankDetailsEmployeeUseCase,
    FindByIdNumberEmployeeUseCase,
    FindByBioNumberEmployeeUseCase,
    RetrieveActiveEmployeesUseCase,
    FindEmployeesEligibleForLeaveUseCase,
    // Export repository tokens for use in other modules
    SHARED_DOMAIN_TOKENS.BRANCH,
    SHARED_DOMAIN_TOKENS.DEPARTMENT,
    SHARED_DOMAIN_TOKENS.JOBTITLE,
    SHARED_DOMAIN_TOKENS.HOLIDAY,
    SHARED_DOMAIN_TOKENS.EMPLOYEE,
    SHARED_DOMAIN_TOKENS.LEAVE_TYPE,
  ],
})
export class SharedDomainModule {}
