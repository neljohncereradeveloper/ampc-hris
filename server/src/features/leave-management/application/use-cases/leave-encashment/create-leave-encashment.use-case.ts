import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveEncashmentBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveEncashment } from '@/features/leave-management/domain/models';
import { LeaveEncashmentRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_ENCASHMENT_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { CreateLeaveEncashmentCommand } from '../../commands/leave-encashment/create-leave-encashment.command';
import { EnumLeaveEncashmentStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class CreateLeaveEncashmentUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_ENCASHMENT)
    private readonly repo: LeaveEncashmentRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateLeaveEncashmentCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveEncashment> {
    return this.transactionHelper.executeTransaction(
      LEAVE_ENCASHMENT_ACTIONS.CREATE,
      async (manager) => {
        const entity = LeaveEncashment.create({
          employee_id: command.employee_id,
          balance_id: command.balance_id,
          total_days: command.total_days,
          amount: command.amount,
          status: EnumLeaveEncashmentStatus.PENDING,
          created_by: requestInfo?.user_name ?? null,
        });

        const created = await this.repo.create(entity, manager);
        if (!created) {
          throw new LeaveEncashmentBusinessException(
            'Leave encashment creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_ENCASHMENT_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS,
          details: JSON.stringify({
            id: created.id,
            employee_id: created.employee_id,
            total_days: created.total_days,
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
