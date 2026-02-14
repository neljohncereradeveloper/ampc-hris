import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { CreateLeaveBalanceCommand } from '../../commands/leave-balance/create-leave-balance.command';
import { EnumLeaveBalanceStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class CreateLeaveBalanceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateLeaveBalanceCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveBalance> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.CREATE,
      async (manager) => {
        const entity = LeaveBalance.create({
          employee_id: command.employee_id,
          leave_type_id: command.leave_type_id,
          policy_id: command.policy_id,
          year: command.year,
          beginning_balance: command.beginning_balance,
          earned: command.earned,
          used: command.used,
          carried_over: command.carried_over,
          encashed: command.encashed,
          remaining: command.remaining,
          status: command.status as EnumLeaveBalanceStatus,
          remarks: command.remarks,
          created_by: requestInfo?.user_name ?? null,
        });

        const created = await this.repo.create(entity, manager);
        if (!created) {
          throw new LeaveBalanceBusinessException(
            'Leave balance creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_BALANCE_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
          details: JSON.stringify({
            id: created.id,
            employee_id: created.employee_id,
            leave_type_id: created.leave_type_id,
            year: created.year,
            created_by: requestInfo?.user_name ?? '',
            created_at: getPHDateTime(created.created_at),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created;
      },
    );
  }
}
