import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveTypeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import {
  LEAVE_TYPE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class RestoreLeaveTypeUseCase {
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
      LEAVE_TYPE_ACTIONS.RESTORE,
      async (manager) => {
        const leaveType = await this.leaveTypeRepository.findById(id, manager);
        if (!leaveType) {
          throw new LeaveTypeBusinessException(
            `Leave type with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        leaveType.restore();

        const success = await this.leaveTypeRepository.update(
          id,
          leaveType,
          manager,
        );
        if (!success) {
          throw new LeaveTypeBusinessException(
            'Leave type restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_TYPE_ACTIONS.RESTORE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES,
          details: JSON.stringify({
            id,
            desc1: leaveType.desc1,
            explanation: `Leave type with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
