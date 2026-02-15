import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PolicyActivationService } from '@/features/leave-management/domain/services';
import { EnumLeavePolicyStatus } from '@/features/leave-management/domain';

@Injectable()
export class RetirePolicyUseCase {
  private readonly activation_service = new PolicyActivationService();

  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    expiry_date?: Date,
    requestInfo?: RequestInfo,
  ): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.RETIRE,
      async (manager) => {
        const policy = await this.leavePolicyRepository.findById(id, manager);
        if (!policy) {
          throw new LeavePolicyBusinessException(
            'Leave policy not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const can_retire =
          this.activation_service.canRetirePolicy(policy);
        if (!can_retire.canRetire) {
          throw new LeavePolicyBusinessException(
            can_retire.reason ?? 'Policy cannot be retired',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const success = await this.leavePolicyRepository.retirePolicy(
          id,
          manager,
          expiry_date,
        );
        if (!success) {
          throw new LeavePolicyBusinessException(
            'Leave policy retirement failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_POLICY_ACTIONS.RETIRE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES,
          details: JSON.stringify({
            id,
            leave_type_id: policy.leave_type_id,
            leave_type_name: policy.leave_type,
            status: EnumLeavePolicyStatus.RETIRED,
            retired_by: requestInfo?.user_name ?? '',
            retired_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
