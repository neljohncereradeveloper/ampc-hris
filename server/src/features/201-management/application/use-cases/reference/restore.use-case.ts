import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ReferenceBusinessException } from '@/features/201-management/domain/exceptions';
import { ReferenceRepository } from '@/features/201-management/domain/repositories';
import {
  REFERENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreReferenceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.REFERENCE)
    private readonly referenceRepository: ReferenceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      REFERENCE_ACTIONS.RESTORE,
      async (manager) => {
        const reference = await this.referenceRepository.findById(id, manager);
        if (!reference) {
          throw new ReferenceBusinessException(
            `Reference with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        reference.restore();

        const success = await this.referenceRepository.update(
          id,
          reference,
          manager,
        );
        if (!success) {
          throw new ReferenceBusinessException(
            'Reference restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: REFERENCE_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.REFERENCES,
          details: JSON.stringify({
            id,
            employee_id: reference.employee_id,
            fname: reference.fname,
            mname: reference.mname,
            lname: reference.lname,
            suffix: reference.suffix,
            cellphone_number: reference.cellphone_number,
            explanation: `Reference with ID : ${id} restored by USER : ${
              requestInfo?.user_name || ''
            }`,
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
