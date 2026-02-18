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
import { CreateDepartmentCommand } from '../../commands/department/create-department.command';

@Injectable()
export class CreateDepartmentUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateDepartmentCommand,
    requestInfo?: RequestInfo,
  ): Promise<Department> {
    return this.transactionHelper.executeTransaction(
      DEPARTMENT_ACTIONS.CREATE,
      async (manager) => {
        const new_department = Department.create({
          desc1: command.desc1,
          code: command.code,
          designation: command.designation,
          remarks: command.remarks,
          created_by: requestInfo?.user_name || null,
        });

        const created_department = await this.departmentRepository.create(
          new_department,
          manager,
        );

        if (!created_department) {
          throw new DepartmentBusinessException(
            'Department creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: DEPARTMENT_ACTIONS.CREATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS,
          details: JSON.stringify({
            id: created_department.id,
            desc1: created_department.desc1,
            code: created_department.code,
            designation: created_department.designation,
            remarks: created_department.remarks,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_department.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_department;
      },
    );
  }
}
