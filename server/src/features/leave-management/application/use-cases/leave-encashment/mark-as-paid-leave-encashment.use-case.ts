import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveEncashmentBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveEncashmentRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_ENCASHMENT_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { MarkAsPaidLeaveEncashmentCommand } from '../../commands/leave-encashment/mark-as-paid-leave-encashment.command';
import { EnumLeaveEncashmentStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class MarkAsPaidLeaveEncashmentUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_ENCASHMENT)
    private readonly repo: LeaveEncashmentRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: MarkAsPaidLeaveEncashmentCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_ENCASHMENT_ACTIONS.MARK_AS_PAID,
      async (manager) => {
        const encashment = await this.repo.findById(id, manager);
        if (!encashment) {
          throw new LeaveEncashmentBusinessException(
            'Leave encashment not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        if (encashment.status !== EnumLeaveEncashmentStatus.PENDING) {
          throw new LeaveEncashmentBusinessException(
            'Only PENDING leave encashments can be marked as paid',
            HTTP_STATUS.CONFLICT,
          );
        }

        const success = await this.repo.markAsPaid(
          id,
          command.payroll_ref,
          manager,
        );
        if (!success) {
          throw new LeaveEncashmentBusinessException(
            'Mark as paid failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_ENCASHMENT_ACTIONS.MARK_AS_PAID,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS,
          details: JSON.stringify({
            id,
            payroll_ref: command.payroll_ref,
            marked_by: requestInfo?.user_name ?? '',
            marked_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
