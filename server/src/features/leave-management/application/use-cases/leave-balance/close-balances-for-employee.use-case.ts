import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import { EnumLeaveBalanceStatus } from '@/features/leave-management/domain/enum';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';

/**
 * Closes all open/reopened leave balances for an employee for a given year.
 * Use when an employee resigns before year-end to close their balances in one operation.
 */
@Injectable()
export class CloseBalancesForEmployeeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    employee_id: number,
    year: string,
    requestInfo?: RequestInfo,
  ): Promise<{ closed_count: number }> {
    if (!year?.trim()) {
      throw new LeaveBalanceBusinessException(
        'Year is required',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.CLOSE_BALANCES_FOR_EMPLOYEE,
      async (manager) => {
        const balances = await this.repo.loadEmployeeBalancesByYear(
          employee_id,
          year,
          manager,
        );
        const toClose = balances.filter(
          (b) =>
            b.status === EnumLeaveBalanceStatus.OPEN ||
            b.status === EnumLeaveBalanceStatus.REOPENED,
        );

        let closed_count = 0;
        for (const balance of toClose) {
          if (balance.id == null) continue;
          const success = await this.repo.closeBalance(balance.id, manager);
          if (success) closed_count += 1;
        }

        const log = ActivityLog.create({
          action: LEAVE_BALANCE_ACTIONS.CLOSE_BALANCES_FOR_EMPLOYEE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
          details: JSON.stringify({
            employee_id,
            year,
            closed_count,
            closed_by: requestInfo?.user_name ?? '',
            closed_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return { closed_count };
      },
    );
  }
}
