import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestTwoBusinessException } from '@/features/test/domain/exceptions';
import { TestTwo } from '@/features/test/domain/models';
import { TestTwoRepository } from '@/features/test/domain/repositories';
import {
  TEST_TWO_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { CreateTestTwoCommand } from '../../commands/test-two/create-test-two.command';

@Injectable()
export class CreateTestTwoUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_TWO)
    private readonly testTwoRepository: TestTwoRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateTestTwoCommand,
    requestInfo?: RequestInfo,
  ): Promise<TestTwo> {
    return this.transactionHelper.executeTransaction(
      TEST_TWO_ACTIONS.CREATE,
      async (manager) => {
        const new_test_two = TestTwo.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_test_two = await this.testTwoRepository.create(
          new_test_two,
          manager,
        );

        if (!created_test_two) {
          throw new TestTwoBusinessException(
            'TestTwo creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_TWO_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.TEST_TWOS,
          details: JSON.stringify({
            id: created_test_two.id,
            desc1: created_test_two.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_test_two.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_test_two;
      },
    );
  }
}
