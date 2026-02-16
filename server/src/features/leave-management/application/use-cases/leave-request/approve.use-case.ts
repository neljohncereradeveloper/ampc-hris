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
import { ApproveLeaveRequestCommand } from '../../commands/leave-request/approve.command';
import {
  EnumLeaveRequestStatus,
  EnumLeaveTransactionType,
} from '@/features/leave-management/domain/enum';

@Injectable()
export class ApproveLeaveRequestUseCase {
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
    command: ApproveLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    const request_id = Number(id);
    if (requestInfo?.user_id == null) {
      throw new LeaveRequestBusinessException(
        'Authentication required. User ID is required to approve a leave request.',
        HTTP_STATUS.UNAUTHORIZED,
      );
    }
    const userId = Number(requestInfo.user_id);
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.APPROVE,
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
         * Validate that the leave request is PENDING.
         */
        if (request.status !== EnumLeaveRequestStatus.PENDING) {
          throw new LeaveRequestBusinessException(
            'Only PENDING leave requests can be approved',
            HTTP_STATUS.CONFLICT,
          );
        }

        /**
         * Validate that the leave balance exist.
         */
        const balance = await this.leaveBalanceRepository.findById(
          request.balance_id,
          manager,
        );
        if (!balance) {
          throw new LeaveRequestBusinessException(
            'Leave balance not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        /**
         * Validate that the leave balance has enough remaining days.
         */
        const total_days = Number(request.total_days);
        const remaining_days = Number(balance.remaining);
        const used_days = Number(balance.used);
        if (remaining_days < total_days) {
          throw new LeaveRequestBusinessException(
            `Insufficient leave balance: remaining ${remaining_days}, requested ${total_days}.`,
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        /**
         * Update the leave balance.
         */
        balance.update({
          used: used_days + total_days,
          remaining: remaining_days - total_days,
          last_transaction_date: getPHDateTime(),
          updated_by: requestInfo?.user_name ?? null,
        });

        /**
         * Update the leave balance.
         */
        await this.leaveBalanceRepository.update(
          Number(balance.id!),
          balance,
          manager,
        );

        /**
         * Record the leave transaction.
         */
        await this.leaveTransactionRepository.recordTransaction(
          Number(request.balance_id),
          EnumLeaveTransactionType.REQUEST,
          -total_days,
          command.remarks ?? `Approved leave request ${request_id}`,
          userId,
          manager,
        );

        const success = await this.leaveRequestRepository.updateStatus(
          request_id,
          EnumLeaveRequestStatus.APPROVED,
          userId,
          command.remarks ?? '',
          manager,
        );
        if (!success) {
          throw new LeaveRequestBusinessException(
            'Leave request approval failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.APPROVE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: request_id,
            approved_by: requestInfo?.user_name ?? '',
            approved_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
