import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestOneBusinessException } from '@/features/test/domain/exceptions';
import { TestOne } from '@/features/test/domain/models';
import { TestOneRepository } from '@/features/test/domain/repositories';
import {
  TEST_ONE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { UpdateTestOneCommand } from '../../commands/test-one/update-test-one.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateTestOneUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_ONE)
    private readonly testOneRepository: TestOneRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateTestOneCommand,
    requestInfo?: RequestInfo,
  ): Promise<TestOne | null> {
    return this.transactionHelper.executeTransaction(
      TEST_ONE_ACTIONS.UPDATE,
      async (manager) => {
        const test_one = await this.testOneRepository.findById(id, manager);
        if (!test_one) {
          throw new TestOneBusinessException(
            'TestOne not found',
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

        const before_state = extractEntityState(test_one, tracking_config);

        test_one.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.testOneRepository.update(
          id,
          test_one,
          manager,
        );
        if (!success) {
          throw new TestOneBusinessException(
            'TestOne update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.testOneRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: TEST_ONE_ACTIONS.UPDATE,
          entity: TEST_DATABASE_MODELS.TEST_ONES,
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
