import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestBusinessException } from '@/features/leave-management/domain/exceptions';
import {
  LeaveRequestRepository,
  LeaveBalanceRepository,
  LeaveTransactionRepository,
} from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeaveRequestStatusCommand } from '../../commands/leave-request/update-leave-request-status.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class CancelLeaveRequestUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_TRANSACTION)
    private readonly leaveTransactionRepository: LeaveTransactionRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateLeaveRequestStatusCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.CANCEL,
      async (manager) => {
        const request = await this.leaveRequestRepository.findById(id, manager);
        if (!request) {
          throw new LeaveRequestBusinessException(
            'Leave request not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        if (
          request.status !== EnumLeaveRequestStatus.PENDING &&
          request.status !== EnumLeaveRequestStatus.APPROVED
        ) {
          throw new LeaveRequestBusinessException(
            'Only PENDING or APPROVED leave requests can be cancelled',
            HTTP_STATUS.CONFLICT,
          );
        }

        if (request.status === EnumLeaveRequestStatus.APPROVED) {
          const balance = await this.leaveBalanceRepository.findById(
            request.balance_id,
            manager,
          );
          if (balance) {
            balance.update({
              used: balance.used - request.total_days,
              remaining: balance.remaining + request.total_days,
              last_transaction_date: getPHDateTime(),
              updated_by: requestInfo?.user_name ?? null,
            });
            balance.updated_at = getPHDateTime();
            await this.leaveBalanceRepository.update(
              balance.id!,
              balance,
              manager,
            );
            await this.leaveTransactionRepository.recordTransaction(
              request.balance_id,
              'earn',
              request.total_days,
              command.remarks ?? `Cancelled leave request ${id} (reversal)`,
              command.approver_id ?? 0,
              manager,
            );
          }
        }

        const success = await this.leaveRequestRepository.updateStatus(
          id,
          EnumLeaveRequestStatus.CANCELLED,
          command.approver_id,
          command.remarks ?? '',
          manager,
        );
        if (!success) {
          throw new LeaveRequestBusinessException(
            'Leave request cancellation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.CANCEL,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id,
            cancelled_by: requestInfo?.user_name ?? '',
            cancelled_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
