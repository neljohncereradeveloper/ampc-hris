import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestTwoBusinessException } from '@/features/test/domain/exceptions';
import { TestTwoRepository } from '@/features/test/domain/repositories';
import {
  TEST_TWO_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class RestoreTestTwoUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_TWO)
    private readonly testTwoRepository: TestTwoRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      TEST_TWO_ACTIONS.RESTORE,
      async (manager) => {
        const test_two = await this.testTwoRepository.findById(id, manager);
        if (!test_two) {
          throw new TestTwoBusinessException(
            `TestTwo with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        test_two.restore();

        const success = await this.testTwoRepository.update(
          id,
          test_two,
          manager,
        );
        if (!success) {
          throw new TestTwoBusinessException(
            'TestTwo restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_TWO_ACTIONS.RESTORE,
          entity: TEST_DATABASE_MODELS.TEST_TWOS,
          details: JSON.stringify({
            id,
            desc1: test_two.desc1,
            explanation: `TestTwo with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
