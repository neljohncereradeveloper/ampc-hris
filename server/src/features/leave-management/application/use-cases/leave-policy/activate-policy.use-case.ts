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

@Injectable()
export class ActivatePolicyUseCase {
  private readonly activation_service = new PolicyActivationService();

  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.ACTIVATE,
      async (manager) => {
        const policy = await this.leavePolicyRepository.findById(id, manager);
        if (!policy) {
          throw new LeavePolicyBusinessException(
            'Leave policy not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const existing_active_policy =
          await this.leavePolicyRepository.getActivePolicy(
            policy.leave_type_id,
            manager,
          );

        const validation = this.activation_service.canActivatePolicy(
          policy,
          existing_active_policy,
        );
        if (!validation.canActivate) {
          throw new LeavePolicyBusinessException(
            validation.reason ?? 'Policy cannot be activated',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        if (validation.shouldRetireExisting && validation.existingPolicyId) {
          let old_policy_expiry_date: Date | undefined;
          if (policy.effective_date) {
            old_policy_expiry_date = new Date(policy.effective_date);
            old_policy_expiry_date.setDate(
              old_policy_expiry_date.getDate() - 1,
            );
          } else {
            old_policy_expiry_date = getPHDateTime();
          }

          const retire_success = await this.leavePolicyRepository.retirePolicy(
            validation.existingPolicyId,
            manager,
            old_policy_expiry_date,
          );
          if (!retire_success) {
            throw new LeavePolicyBusinessException(
              'Failed to retire existing active policy',
              HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
          }
        }

        const success = await this.leavePolicyRepository.activatePolicy(
          id,
          manager,
        );
        if (!success) {
          throw new LeavePolicyBusinessException(
            'Leave policy activation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_POLICY_ACTIONS.ACTIVATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES,
          details: JSON.stringify({
            id,
            leave_type_id: policy.leave_type_id,
            status: 'active',
            activated_by: requestInfo?.user_name ?? '',
            activated_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
