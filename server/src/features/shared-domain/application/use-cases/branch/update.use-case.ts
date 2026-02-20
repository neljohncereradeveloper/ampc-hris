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
import { UpdateBranchCommand } from '../../commands/branch/update-branch.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateBranchUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateBranchCommand,
    requestInfo?: RequestInfo,
  ): Promise<Branch | null> {
    return this.transactionHelper.executeTransaction(
      BRANCH_ACTIONS.UPDATE,
      async (manager) => {
        const branch = await this.branchRepository.findById(id, manager);
        if (!branch) {
          throw new BranchBusinessException(
            'Branch not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          { field: 'br_code' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(branch, tracking_config);

        branch.update({
          desc1: command.desc1,
          br_code: command.br_code,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.branchRepository.update(id, branch, manager);
        if (!success) {
          throw new BranchBusinessException(
            'Branch update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.branchRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: BRANCH_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.BRANCHES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
