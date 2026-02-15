import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveLeavePolicyUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.ARCHIVE,
      async (manager) => {
        const policy = await this.leavePolicyRepository.findById(id, manager);
        if (!policy) {
          throw new LeavePolicyBusinessException(
            `Leave policy with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        policy.archive(requestInfo?.user_name ?? '');

        const success = await this.leavePolicyRepository.update(
          id,
          policy,
          manager,
        );
        if (!success) {
          throw new LeavePolicyBusinessException(
            'Leave policy archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_POLICY_ACTIONS.ARCHIVE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES,
          details: JSON.stringify({
            id,
            leave_type_id: policy.leave_type_id,
            archived_by: requestInfo?.user_name ?? '',
            archived_at: getPHDateTime(policy.deleted_at ?? new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
