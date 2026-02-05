import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EmploymentTypeBusinessException } from '@/features/201-management/domain/exceptions';
import { EmploymentType } from '@/features/201-management/domain/models';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_TYPE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateEmploymentTypeCommand } from '../../commands/employment-type/create-employment-type.command';

@Injectable()
export class CreateEmploymentTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateEmploymentTypeCommand,
    requestInfo?: RequestInfo,
  ): Promise<EmploymentType> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_TYPE_ACTIONS.CREATE,
      async (manager) => {
        const new_employment_type = EmploymentType.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_employment_type =
          await this.employmentTypeRepository.create(
            new_employment_type,
            manager,
          );

        if (!created_employment_type) {
          throw new EmploymentTypeBusinessException(
            'Employment type creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: EMPLOYMENT_TYPE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES,
          details: JSON.stringify({
            id: created_employment_type.id,
            desc1: created_employment_type.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_employment_type.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_employment_type;
      },
    );
  }
}
