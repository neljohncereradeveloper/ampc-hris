import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveRequest } from '@/features/leave-management/domain/models';
import {
  LeaveRequestRepository,
  LeaveBalanceRepository,
} from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeaveRequestCommand } from '../../commands/leave-request/update-leave-request.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class UpdateLeaveRequestUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveRequest | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.UPDATE,
      async (manager) => {
        const request = await this.leaveRequestRepository.findById(id, manager);
        if (!request) {
          throw new LeaveRequestBusinessException(
            'Leave request not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        if (request.status !== EnumLeaveRequestStatus.PENDING) {
          throw new LeaveRequestBusinessException(
            'Only PENDING leave requests can be updated',
            HTTP_STATUS.CONFLICT,
          );
        }

        const balance_id = command.balance_id ?? request.balance_id;
        const balance = await this.leaveBalanceRepository.findById(
          balance_id,
          manager,
        );
        if (!balance) {
          throw new LeaveRequestBusinessException(
            'Leave balance not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        request.update({
          start_date: command.start_date,
          end_date: command.end_date,
          total_days: command.total_days,
          reason: command.reason,
          balance_id: command.balance_id,
          remarks: command.remarks,
          updated_by: requestInfo?.user_name ?? null,
        });
        request.assertBalanceSufficient(balance);

        const overlapping = await this.leaveRequestRepository.findOverlappingRequests(
          request.employee_id,
          request.start_date,
          request.end_date,
          manager,
          id,
        );
        const has_overlap = overlapping.some(
          (r) =>
            r.status === EnumLeaveRequestStatus.PENDING ||
            r.status === EnumLeaveRequestStatus.APPROVED,
        );
        if (has_overlap) {
          throw new LeaveRequestBusinessException(
            'Overlapping leave request exists for this period.',
            HTTP_STATUS.CONFLICT,
          );
        }

        const success = await this.leaveRequestRepository.update(
          id,
          request,
          manager,
        );
        if (!success) {
          throw new LeaveRequestBusinessException(
            'Leave request update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated = await this.leaveRequestRepository.findById(id, manager);
        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.UPDATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: updated?.id,
            updated_by: requestInfo?.user_name ?? '',
            updated_at: getPHDateTime(updated?.updated_at ?? new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated;
      },
    );
  }
}
