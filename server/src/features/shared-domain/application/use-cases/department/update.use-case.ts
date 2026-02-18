import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { DepartmentBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Department } from '@/features/shared-domain/domain/models';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import {
  DEPARTMENT_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateDepartmentCommand } from '../../commands/department/update-department.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateDepartmentUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateDepartmentCommand,
    requestInfo?: RequestInfo,
  ): Promise<Department | null> {
    return this.transactionHelper.executeTransaction(
      DEPARTMENT_ACTIONS.UPDATE,
      async (manager) => {
        const department = await this.departmentRepository.findById(
          id,
          manager,
        );
        if (!department) {
          throw new DepartmentBusinessException(
            'Department not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          { field: 'code' },
          { field: 'designation' },
          { field: 'remarks' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(department, tracking_config);

        department.update({
          desc1: command.desc1,
          code: command.code,
          designation: command.designation,
          remarks: command.remarks,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.departmentRepository.update(
          id,
          department,
          manager,
        );
        if (!success) {
          throw new DepartmentBusinessException(
            'Department update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.departmentRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: DEPARTMENT_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS,
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
