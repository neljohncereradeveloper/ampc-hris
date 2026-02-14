/**
 * Dependency injection tokens for leave-management feature repositories and services.
 * Use these tokens when injecting leave-management repositories in use cases.
 */
export const LEAVE_MANAGEMENT_TOKENS = {
  LEAVE_POLICY: 'LeavePolicyRepository',
  LEAVE_REQUEST: 'LeaveRequestRepository',
  LEAVE_BALANCE: 'LeaveBalanceRepository',
  LEAVE_CYCLE: 'LeaveCycleRepository',
  LEAVE_TRANSACTION: 'LeaveTransactionRepository',
  LEAVE_YEAR_CONFIGURATION: 'LeaveYearConfigurationRepository',
  LEAVE_ENCASHMENT: 'LeaveEncashmentRepository',
} as const;
