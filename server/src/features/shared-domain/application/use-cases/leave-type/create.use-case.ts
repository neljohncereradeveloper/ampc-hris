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
import { CreateLeaveTypeCommand } from '../../commands/leave-type/create-leave-type.command';

@Injectable()
export class CreateLeaveTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateLeaveTypeCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveType> {
    return this.transactionHelper.executeTransaction(
      LEAVE_TYPE_ACTIONS.CREATE,
      async (manager) => {
        const existing_leave_type = await this.leaveTypeRepository.findByCode(
          command.code,
          manager,
        );
        if (existing_leave_type) {
          throw new LeaveTypeBusinessException(
            'Leave type code already exists',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
        const existing_leave_type_name = await this.leaveTypeRepository.findByName(
          command.name,
          manager,
        );
        if (existing_leave_type_name) {
          throw new LeaveTypeBusinessException(
            'Leave type name already exists',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
        const new_leaveType = LeaveType.create({
          name: command.name,
          code: command.code,
          desc1: command.desc1,
          paid: command.paid,
          remarks: command.remarks,
          created_by: requestInfo?.user_name || null,
        });

        const created_leaveType = await this.leaveTypeRepository.create(
          new_leaveType,
          manager,
        );

        if (!created_leaveType) {
          throw new LeaveTypeBusinessException(
            'Leave type creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_TYPE_ACTIONS.CREATE,
          entity: SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES,
          details: JSON.stringify({
            id: created_leaveType.id,
            name: created_leaveType.name,
            code: created_leaveType.code,
            desc1: created_leaveType.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_leaveType.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_leaveType;
      },
    );
  }
}
