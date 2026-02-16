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
 * Resets leave balances for a given year (bulk year-end operation).
 * Repository implementation defines what "reset" means (e.g. close all OPEN balances for that year).
 * This process does not reset all balance amounts to zero; it changes status only.
 * Typically: balances with status OPEN or REOPENED for the year are changed to CLOSED.
 */
@Injectable()
export class ResetBalancesForYearUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(year: string, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.RESET_FOR_YEAR,
      async (manager) => {
        if (!year || year.trim().length === 0) {
          throw new LeaveBalanceBusinessException(
            'Year is required',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const success = await this.repo.resetBalancesForYear(year, manager);
        if (!success) {
          throw new LeaveBalanceBusinessException(
            'Reset balances for year failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_BALANCE_ACTIONS.RESET_FOR_YEAR,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
          details: JSON.stringify({
            year,
            reset_by: requestInfo?.user_name ?? '',
            reset_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
