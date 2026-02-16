/**
 * Leave management feature entities for TypeORM.
 */
import { LeaveRequestEntity } from './leave-request.entity';
import { LeaveBalanceEntity } from './leave-balance.entity';
import { LeavePolicyEntity } from './leave-policy.entity';
import { LeaveYearConfigurationEntity } from './leave-year-configuration.entity';
import { LeaveEncashmentEntity } from './leave-encashment.entity';
import { LeaveTransactionEntity } from './leave-transaction.entity';

export const leaveManagementEntities = [
  LeaveRequestEntity,
  LeaveBalanceEntity,
  LeavePolicyEntity,
  LeaveYearConfigurationEntity,
  LeaveEncashmentEntity,
  LeaveTransactionEntity,
];
