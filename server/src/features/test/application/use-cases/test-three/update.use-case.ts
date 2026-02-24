import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestThreeBusinessException } from '@/features/test/domain/exceptions';
import { TestThree } from '@/features/test/domain/models';
import { TestThreeRepository } from '@/features/test/domain/repositories';
import {
  TEST_THREE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { UpdateTestThreeCommand } from '../../commands/test-three/update-test-three.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateTestThreeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_THREE)
    private readonly testThreeRepository: TestThreeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateTestThreeCommand,
    requestInfo?: RequestInfo,
  ): Promise<TestThree | null> {
    return this.transactionHelper.executeTransaction(
      TEST_THREE_ACTIONS.UPDATE,
      async (manager) => {
        const test_three = await this.testThreeRepository.findById(id, manager);
        if (!test_three) {
          throw new TestThreeBusinessException(
            'TestThree not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(test_three, tracking_config);

        test_three.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.testThreeRepository.update(
          id,
          test_three,
          manager,
        );
        if (!success) {
          throw new TestThreeBusinessException(
            'TestThree update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.testThreeRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: TEST_THREE_ACTIONS.UPDATE,
          entity: TEST_DATABASE_MODELS.TEST_THREES,
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
