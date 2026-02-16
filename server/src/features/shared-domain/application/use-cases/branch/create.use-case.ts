import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { BranchBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Branch } from '@/features/shared-domain/domain/models';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import {
  BRANCH_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { CreateBranchCommand } from '../../commands/branch/create-branch.command';

@Injectable()
export class CreateBranchUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateBranchCommand,
    requestInfo?: RequestInfo,
  ): Promise<Branch> {
    return this.transactionHelper.executeTransaction(
      BRANCH_ACTIONS.CREATE,
      async (manager) => {
        const new_branch = Branch.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_branch = await this.branchRepository.create(
          new_branch,
          manager,
        );

        if (!created_branch) {
          throw new BranchBusinessException(
            'Branch creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: BRANCH_ACTIONS.CREATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.BRANCHES,
          details: JSON.stringify({
            id: created_branch.id,
            desc1: created_branch.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_branch.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_branch;
      },
    );
  }
}
