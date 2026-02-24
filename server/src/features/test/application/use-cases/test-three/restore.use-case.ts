import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestThreeBusinessException } from '@/features/test/domain/exceptions';
import { TestThreeRepository } from '@/features/test/domain/repositories';
import {
  TEST_THREE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class RestoreTestThreeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_THREE)
    private readonly testThreeRepository: TestThreeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      TEST_THREE_ACTIONS.RESTORE,
      async (manager) => {
        const test_three = await this.testThreeRepository.findById(id, manager);
        if (!test_three) {
          throw new TestThreeBusinessException(
            `TestThree with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        test_three.restore();

        const success = await this.testThreeRepository.update(
          id,
          test_three,
          manager,
        );
        if (!success) {
          throw new TestThreeBusinessException(
            'TestThree restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_THREE_ACTIONS.RESTORE,
          entity: TEST_DATABASE_MODELS.TEST_THREES,
          details: JSON.stringify({
            id,
            desc1: test_three.desc1,
            explanation: `TestThree with ID : ${id} restored by USER : ${requestInfo?.user_name || ''}`,
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
