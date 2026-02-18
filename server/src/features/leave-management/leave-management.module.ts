import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';
import { LEAVE_MANAGEMENT_TOKENS } from './domain/constants';
import {
  LeaveRequestRepositoryImpl,
  LeaveBalanceRepositoryImpl,
  LeavePolicyRepositoryImpl,
  LeaveYearConfigurationRepositoryImpl,
  LeaveEncashmentRepositoryImpl,
  LeaveTransactionRepositoryImpl,
} from './infrastructure/database/repositories';
import { ActiveEmployeeIdsAdapter } from './application/adapters/active-employee-ids.adapter';
import { LeaveBalanceBulkCreateService } from './application/services/leave-balance';
import * as LeaveRequestUseCases from './application/use-cases/leave-request';
import * as LeaveBalanceUseCases from './application/use-cases/leave-balance';
import * as LeavePolicyUseCases from './application/use-cases/leave-policy';
import * as LeaveEncashmentUseCases from './application/use-cases/leave-encashment';
import * as LeaveYearConfigurationUseCases from './application/use-cases/leave-year-configuration';
import { SharedDomainModule } from '@/features/shared-domain/shared-domain.module';

const leaveRequestUseCaseList = [
  LeaveRequestUseCases.CreateLeaveRequestUseCase,
  LeaveRequestUseCases.GetPaginatedLeaveRequestUseCase,
  LeaveRequestUseCases.GetPaginatedLeaveRequestByEmployeeUseCase,
  LeaveRequestUseCases.GetPaginatedPendingLeaveRequestsUseCase,
  LeaveRequestUseCases.ApproveLeaveRequestUseCase,
  LeaveRequestUseCases.RejectLeaveRequestUseCase,
  LeaveRequestUseCases.CancelLeaveRequestUseCase,
  LeaveRequestUseCases.UpdateLeaveRequestUseCase,
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

const leavePolicyUseCaseList = [
  LeavePolicyUseCases.CreateLeavePolicyUseCase,
  LeavePolicyUseCases.UpdateLeavePolicyUseCase,
  LeavePolicyUseCases.ArchiveLeavePolicyUseCase,
  LeavePolicyUseCases.RestoreLeavePolicyUseCase,
  LeavePolicyUseCases.GetPaginatedLeavePolicyUseCase,
  LeavePolicyUseCases.GetActivePolicyUseCase,
  LeavePolicyUseCases.RetrieveActivePoliciesUseCase,
  LeavePolicyUseCases.ActivatePolicyUseCase,
  LeavePolicyUseCases.RetirePolicyUseCase,
];

const leaveEncashmentUseCaseList = [
  LeaveEncashmentUseCases.CreateLeaveEncashmentUseCase,
  LeaveEncashmentUseCases.GetPaginatedLeaveEncashmentUseCase,
  LeaveEncashmentUseCases.MarkAsPaidLeaveEncashmentUseCase,
];

const leaveYearConfigurationUseCaseList = [
  LeaveYearConfigurationUseCases.CreateLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.UpdateLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.ArchiveLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.RestoreLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.GetPaginatedLeaveYearConfigurationUseCase,
  LeaveYearConfigurationUseCases.FindActiveLeaveYearForDateUseCase,
];

@Module({
  imports: [PostgresqlDatabaseModule, SharedDomainModule],
  providers: [
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST,
      useClass: LeaveRequestRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE,
      useClass: LeaveBalanceRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY,
      useClass: LeavePolicyRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION,
      useClass: LeaveYearConfigurationRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_ENCASHMENT,
      useClass: LeaveEncashmentRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.LEAVE_TRANSACTION,
      useClass: LeaveTransactionRepositoryImpl,
    },
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    {
      provide: LEAVE_MANAGEMENT_TOKENS.ACTIVE_EMPLOYEE_IDS_PORT,
      useClass: ActiveEmployeeIdsAdapter,
    },
    LeaveBalanceBulkCreateService,
    ...leaveRequestUseCaseList,
    ...leaveBalanceUseCaseList,
    ...leavePolicyUseCaseList,
    ...leaveEncashmentUseCaseList,
    ...leaveYearConfigurationUseCaseList,
  ],
  exports: [
    LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_ENCASHMENT,
    LEAVE_MANAGEMENT_TOKENS.LEAVE_TRANSACTION,
    LEAVE_MANAGEMENT_TOKENS.ACTIVE_EMPLOYEE_IDS_PORT,
    ...leaveRequestUseCaseList,
    ...leaveBalanceUseCaseList,
    ...leavePolicyUseCaseList,
    ...leaveEncashmentUseCaseList,
    ...leaveYearConfigurationUseCaseList,
  ],
})
export class LeaveManagementModule { }
