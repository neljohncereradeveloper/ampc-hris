import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';
import { LEAVE_MANAGEMENT_TOKENS } from './domain/constants';
import {
  LeaveYearConfigurationRepositoryImpl,
  LeaveBalanceRepositoryImpl,
} from './infrastructure/database/repositories';
import * as LeaveYearConfigurationUseCases from './application/use-cases/leave-year-configuration';
import * as LeaveBalanceUseCases from './application/use-cases/leave-balance';
import { SharedDomainModule } from '@/features/shared-domain/shared-domain.module';
import {
  LeaveBalanceController,
  LeaveYearConfigurationController,
} from './presentation/controllers';

/**
 * =========================
 * USE CASES
 * =========================
 */

const leaveYearConfigurationUseCaseList = [
  LeaveYearConfigurationUseCases.CreateLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.UpdateLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.ArchiveLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.RestoreLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.GetPaginatedLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.FindActiveLeaveYearForDateUseCase,
];

const leaveBalanceUseCaseList = [
  LeaveBalanceUseCases.CreateLeaveBalanceUseCase,
  LeaveBalanceUseCases.GetLeaveBalanceByIdUseCase,
  LeaveBalanceUseCases.LoadEmployeeBalancesByLeaveTypeAndYearUseCase,
  LeaveBalanceUseCases.LoadEmployeeBalancesByYearUseCase,
  LeaveBalanceUseCases.CloseBalanceUseCase,
  LeaveBalanceUseCases.CloseBalancesForEmployeeUseCase,
  LeaveBalanceUseCases.ResetBalancesForYearUseCase,
  LeaveBalanceUseCases.GenerateBalancesForAllEmployeesUseCase,
];

@Module({
  imports: [PostgresqlDatabaseModule, SharedDomainModule],
  controllers: [LeaveYearConfigurationController, LeaveBalanceController],
  providers: [
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION,
      useClass: LeaveYearConfigurationRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE,
      useClass: LeaveBalanceRepositoryImpl,
    },
    ...leaveYearConfigurationUseCaseList,
    ...leaveBalanceUseCaseList,
  ],
  exports: [
    LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE,
    ...leaveYearConfigurationUseCaseList,
    ...leaveBalanceUseCaseList,
  ],
})
export class LeaveManagementModule {}
