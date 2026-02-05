import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EmployeeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Employee } from '@/features/shared-domain/domain/models';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateGovernmentDetailsCommand } from '../../commands/employee/update-government-details.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateGovernmentDetailsEmployeeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    employee_id: number,
    command: UpdateGovernmentDetailsCommand,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.UPDATE_GOVERNMENT_DETAILS,
      async (manager) => {
        const employee = await this.employeeRepository.findById(
          employee_id,
          manager,
        );
        if (!employee) {
          throw new EmployeeBusinessException(
            'Employee not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'phic' },
          { field: 'hdmf' },
          { field: 'sss_no' },
          { field: 'tin_no' },
          { field: 'tax_exempt_code' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(employee, tracking_config);

        const government_details: Partial<Employee> = {
          phic: command.phic,
          hdmf: command.hdmf,
          sss_no: command.sss_no,
          tin_no: command.tin_no,
          tax_exempt_code: command.tax_exempt_code,
          updated_by: requestInfo?.user_name || null,
        };

        const success = await this.employeeRepository.updateGovernmentDetails(
          employee_id,
          government_details,
          manager,
        );
        if (!success) {
          throw new EmployeeBusinessException(
            'Employee government details update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.employeeRepository.findById(
          employee_id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EMPLOYEE_ACTIONS.UPDATE_GOVERNMENT_DETAILS,
          entity: SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
