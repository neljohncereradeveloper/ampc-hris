import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveTypeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { LeaveType } from '@/features/shared-domain/domain/models';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import {
  LEAVE_TYPE_ACTIONS,
  SHARED_DOMAIN_DATABASE_MODELS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { UpdateLeaveTypeCommand } from '../../commands/leave-type/update-leave-type.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateLeaveTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateLeaveTypeCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveType | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_TYPE_ACTIONS.UPDATE,
      async (manager) => {
        const leaveType = await this.leaveTypeRepository.findById(id, manager);
        if (!leaveType) {
          throw new LeaveTypeBusinessException(
            'Leave type not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'name' },
          { field: 'code' },
          { field: 'desc1' },
          { field: 'paid' },
          { field: 'remarks' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(leaveType, tracking_config);

        leaveType.update({
          name: command.name,
          code: command.code,
          desc1: command.desc1,
          paid: command.paid,
          remarks: command.remarks,
          updated_by: requestInfo?.user_name || null,
        });
        leaveType.updated_at = getPHDateTime();

        const success = await this.leaveTypeRepository.update(
          id,
          leaveType,
          manager,
        );
        if (!success) {
          throw new LeaveTypeBusinessException(
            'Leave type update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.leaveTypeRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: LEAVE_TYPE_ACTIONS.UPDATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES,
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
