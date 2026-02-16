import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveTypeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import {
  LEAVE_TYPE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveLeaveTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_TYPE_ACTIONS.ARCHIVE,
      async (manager) => {
        const leaveType = await this.leaveTypeRepository.findById(id, manager);
        if (!leaveType) {
          throw new LeaveTypeBusinessException(
            `Leave type with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        leaveType.archive(requestInfo?.user_name || '');

        const success = await this.leaveTypeRepository.update(
          id,
          leaveType,
          manager,
        );
        if (!success) {
          throw new LeaveTypeBusinessException(
            'Leave type archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_TYPE_ACTIONS.ARCHIVE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES,
          details: JSON.stringify({
            id,
            desc1: leaveType.desc1,
            explanation: `Leave type with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(leaveType.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
