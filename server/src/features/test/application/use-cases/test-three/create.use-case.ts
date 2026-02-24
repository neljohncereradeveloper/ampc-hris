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
import { CreateTestThreeCommand } from '../../commands/test-three/create-test-three.command';

@Injectable()
export class CreateTestThreeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_THREE)
    private readonly testThreeRepository: TestThreeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateTestThreeCommand,
    requestInfo?: RequestInfo,
  ): Promise<TestThree> {
    return this.transactionHelper.executeTransaction(
      TEST_THREE_ACTIONS.CREATE,
      async (manager) => {
        const new_test_three = TestThree.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || '',
        });

        const created_test_three = await this.testThreeRepository.create(
          new_test_three,
          manager,
        );

        if (!created_test_three) {
          throw new TestThreeBusinessException(
            'TestThree creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_THREE_ACTIONS.CREATE,
          entity: TEST_DATABASE_MODELS.TEST_THREES,
          details: JSON.stringify({
            id: created_test_three.id,
            desc1: created_test_three.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_test_three.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_test_three;
      },
    );
  }
}
