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
import { CancelLeaveRequestCommand } from '../../commands/leave-request/cancel.command';
import {
  EnumLeaveRequestStatus,
  EnumLeaveTransactionType,
} from '@/features/leave-management/domain/enum';

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
  ) { }

  async execute(
    id: number,
    command: CancelLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    const request_id = Number(id);
    if (requestInfo?.user_id == null) {
      throw new LeaveRequestBusinessException(
        'Authentication required. User ID is required to cancel a leave request.',
        HTTP_STATUS.UNAUTHORIZED,
      );
    }
    const userId = Number(requestInfo.user_id);
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.CANCEL,
      async (manager) => {
        /**
         * Validate that the leave request is valid and not archived.
         */
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
        /**
         * Validate that the leave request is PENDING or APPROVED.
         */
        if (
          request.status !== EnumLeaveRequestStatus.PENDING &&
          request.status !== EnumLeaveRequestStatus.APPROVED
        ) {
          throw new LeaveRequestBusinessException(
            'Only PENDING or APPROVED leave requests can be cancelled',
            HTTP_STATUS.CONFLICT,
          );
        }

        /**
         * If the leave request is APPROVED, reverse the balance.
         */
        if (request.status === EnumLeaveRequestStatus.APPROVED) {
          const balance_id = Number(request.balance_id);
          const total_days = Number(request.total_days);
          const balance = await this.leaveBalanceRepository.findById(
            balance_id,
            manager,
          );
          /**
           * Validate that the balance is valid and not archived.
           */
          if (balance) {
            balance.update({
              used: Number(balance.used) - total_days,
              remaining: Number(balance.remaining) + total_days,
              last_transaction_date: getPHDateTime(),
              updated_by: requestInfo?.user_name ?? null,
            });
            /**
             * Update the balance.
             */
            await this.leaveBalanceRepository.update(
              Number(balance.id!),
              balance,
              manager,
            );
            /**
             * Record the transaction.
             */
            await this.leaveTransactionRepository.recordTransaction(
              balance_id,
              EnumLeaveTransactionType.ADJUSTMENT,
              total_days,
              command.remarks ?? `Cancelled leave request ${request_id} (reversal)`,
              userId,
              manager,
            );
          }
        }

        /**
         * Update the leave request status to CANCELLED.
         */
        const success = await this.leaveRequestRepository.updateStatus(
          request_id,
          EnumLeaveRequestStatus.CANCELLED,
          userId,
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
            id: request_id,
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
