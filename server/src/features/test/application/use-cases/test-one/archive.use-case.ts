import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { TestOneBusinessException } from '@/features/test/domain/exceptions';
import { TestOneRepository } from '@/features/test/domain/repositories';
import {
  TEST_ONE_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveTestOneUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.TEST_ONE)
    private readonly testOneRepository: TestOneRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      TEST_ONE_ACTIONS.ARCHIVE,
      async (manager) => {
        const test_one = await this.testOneRepository.findById(id, manager);
        if (!test_one) {
          throw new TestOneBusinessException(
            `testOne with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        test_one.archive(requestInfo?.user_name || '');

        const success = await this.testOneRepository.update(
          id,
          test_one,
          manager,
        );
        if (!success) {
          throw new TestOneBusinessException(
            'TestOne archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TEST_ONE_ACTIONS.ARCHIVE,
          entity: TEST_DATABASE_MODELS.TEST_ONES,
          details: JSON.stringify({
            id,
            desc1: test_one.desc1,
            explanation: `testOne with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(test_one.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
