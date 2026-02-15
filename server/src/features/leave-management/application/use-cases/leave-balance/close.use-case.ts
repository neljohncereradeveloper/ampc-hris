import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';

/**
 * Closes a single leave balance by id.
 * Use at year-end (in batch) or when an employee resigns to close their balance(s) early.
 */
@Injectable()
export class CloseBalanceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.CLOSE,
      async (manager) => {
        const balance = await this.repo.findById(id, manager);
        if (!balance) {
          throw new LeaveBalanceBusinessException(
            'Leave balance not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const success = await this.repo.closeBalance(id, manager);
        if (!success) {
          throw new LeaveBalanceBusinessException(
            'Leave balance close failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_BALANCE_ACTIONS.CLOSE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
          details: JSON.stringify({
            id,
            employee_id: balance.employee_id,
            leave_type_id: balance.leave_type_id,
            year: balance.year,
            closed_by: requestInfo?.user_name ?? '',
            closed_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
