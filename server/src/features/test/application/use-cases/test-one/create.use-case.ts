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
import { CreateTestOneCommand } from '../../commands/test-one/create-test-one.command';

@Injectable()
export class CreateTestOneUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_ONE)
    private readonly testOneRepository: TestOneRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateTestOneCommand,
    requestInfo?: RequestInfo,
  ): Promise<TestOne> {
    return this.transactionHelper.executeTransaction(
      TEST_ONE_ACTIONS.CREATE,
      async (manager) => {
        const new_test_one = TestOne.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_test_one = await this.testOneRepository.create(
          new_test_one,
          manager,
        );

        if (!created_test_one) {
          throw new TestOneBusinessException(
            'TestOne creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_ONE_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.TEST_ONES,
          details: JSON.stringify({
            id: created_test_one.id,
            desc1: created_test_one.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_test_one.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_test_one;
      },
    );
  }
}
