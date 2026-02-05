import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ReferenceBusinessException } from '@/features/201-management/domain/exceptions';
import { Reference } from '@/features/201-management/domain/models';
import { ReferenceRepository } from '@/features/201-management/domain/repositories';
import {
  REFERENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateReferenceCommand } from '../../commands/reference/create-reference.command';

@Injectable()
export class CreateReferenceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.REFERENCE)
    private readonly referenceRepository: ReferenceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateReferenceCommand,
    requestInfo?: RequestInfo,
  ): Promise<Reference> {
    return this.transactionHelper.executeTransaction(
      REFERENCE_ACTIONS.CREATE,
      async (manager) => {
        const new_reference = Reference.create({
          employee_id: command.employee_id,
          fname: command.fname,
          mname: command.mname,
          lname: command.lname,
          suffix: command.suffix,
          cellphone_number: command.cellphone_number,
          created_by: requestInfo?.user_name || null,
        });

        const created_reference = await this.referenceRepository.create(
          new_reference,
          manager,
        );

        if (!created_reference) {
          throw new ReferenceBusinessException(
            'Reference creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: REFERENCE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.REFERENCES,
          details: JSON.stringify({
            id: created_reference.id,
            employee_id: created_reference.employee_id,
            fname: created_reference.fname,
            mname: created_reference.mname,
            lname: created_reference.lname,
            suffix: created_reference.suffix,
            cellphone_number: created_reference.cellphone_number,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_reference.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_reference;
      },
    );
  }
}
