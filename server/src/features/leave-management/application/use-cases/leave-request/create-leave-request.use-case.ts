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
import { CreateLeaveRequestCommand } from '../../commands/leave-request/create-leave-request.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class CreateLeaveRequestUseCase {
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
    command: CreateLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveRequest> {
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.CREATE,
      async (manager) => {
        const balance = await this.leaveBalanceRepository.findById(
          command.balance_id,
          manager,
        );
        if (!balance) {
          throw new LeaveRequestBusinessException(
            'Leave balance not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const request = LeaveRequest.create({
          employee_id: command.employee_id,
          leave_type_id: command.leave_type_id,
          start_date: command.start_date,
          end_date: command.end_date,
          total_days: command.total_days,
          reason: command.reason,
          balance_id: command.balance_id,
          remarks: command.remarks,
          created_by: requestInfo?.user_name ?? null,
        });

        request.assertBalanceSufficient(balance);

        const overlapping = await this.leaveRequestRepository.findOverlappingRequests(
          command.employee_id,
          command.start_date,
          command.end_date,
          manager,
          undefined,
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

        const created = await this.leaveRequestRepository.create(
          request,
          manager,
        );
        if (!created) {
          throw new LeaveRequestBusinessException(
            'Leave request creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: created.id,
            employee_id: created.employee_id,
            leave_type_id: created.leave_type_id,
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
