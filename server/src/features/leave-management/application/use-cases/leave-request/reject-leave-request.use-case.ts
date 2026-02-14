import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveRequestRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeaveRequestStatusCommand } from '../../commands/leave-request/update-leave-request-status.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class RejectLeaveRequestUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateLeaveRequestStatusCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    const request_id = Number(id);
    const approver_id = Number(command.approver_id ?? 0);
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.REJECT,
      async (manager) => {
        const request = await this.leaveRequestRepository.findById(
          request_id,
          manager,
        );
        if (!request) {
          throw new LeaveRequestBusinessException(
            'Leave request not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        if (request.status !== EnumLeaveRequestStatus.PENDING) {
          throw new LeaveRequestBusinessException(
            'Only PENDING leave requests can be rejected',
            HTTP_STATUS.CONFLICT,
          );
        }

        const success = await this.leaveRequestRepository.updateStatus(
          request_id,
          EnumLeaveRequestStatus.REJECTED,
          approver_id,
          command.remarks ?? '',
          manager,
        );
        if (!success) {
          throw new LeaveRequestBusinessException(
            'Leave request rejection failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.REJECT,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: request_id,
            rejected_by: requestInfo?.user_name ?? '',
            rejected_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
