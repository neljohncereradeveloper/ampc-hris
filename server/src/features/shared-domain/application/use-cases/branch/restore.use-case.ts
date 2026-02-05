import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { BranchBusinessException } from '@/features/shared-domain/domain/exceptions';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import {
  BRANCH_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class RestoreBranchUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      BRANCH_ACTIONS.RESTORE,
      async (manager) => {
        const branch = await this.branchRepository.findById(id, manager);
        if (!branch) {
          throw new BranchBusinessException(
            `Branch with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        branch.restore();

        const success = await this.branchRepository.update(
          id,
          branch,
          manager,
        );
        if (!success) {
          throw new BranchBusinessException(
            'Branch restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: BRANCH_ACTIONS.RESTORE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.BRANCHES,
          details: JSON.stringify({
            id,
            desc1: branch.desc1,
            explanation: `Branch with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
