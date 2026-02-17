import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeavePolicy } from '@/features/leave-management/domain/models';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeavePolicyCommand } from '../../commands/leave-policy/update.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';
import { PolicyActivationService } from '@/features/leave-management/domain/services';

@Injectable()
export class UpdateLeavePolicyUseCase {
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
    command: UpdateLeavePolicyCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeavePolicy | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.UPDATE,
      async (manager) => {
        const policy = await this.leavePolicyRepository.findById(id, manager);
        if (!policy) {
          throw new LeavePolicyBusinessException(
            'Leave policy not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const can_update = this.activation_service.canUpdatePolicy(policy);
        if (!can_update.canUpdate) {
          throw new LeavePolicyBusinessException(
            can_update.reason ?? 'Policy cannot be updated',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'annual_entitlement' },
          { field: 'carry_limit' },
          { field: 'encash_limit' },
          { field: 'carried_over_years' },
          { field: 'effective_date' },
          { field: 'expiry_date' },
          { field: 'remarks' },
          { field: 'minimum_service_months' },
          { field: 'allowed_employment_types' },
          { field: 'allowed_employee_statuses' },
          { field: 'excluded_weekdays' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];
        const before_state = extractEntityState(policy, tracking_config);

        policy.update({
          annual_entitlement: command.annual_entitlement,
          carry_limit: command.carry_limit,
          encash_limit: command.encash_limit,
          carried_over_years: command.carried_over_years,
          effective_date: command.effective_date,
          expiry_date: command.expiry_date,
          remarks: command.remarks,
          minimum_service_months: command.minimum_service_months,
          allowed_employment_types: command.allowed_employment_types,
          allowed_employee_statuses: command.allowed_employee_statuses,
          excluded_weekdays: command.excluded_weekdays,
          updated_by: requestInfo?.user_name ?? null,
        });

        const parameter_validation =
          this.activation_service.validatePolicyParameters(policy);
        if (!parameter_validation.isValid) {
          throw new LeavePolicyBusinessException(
            parameter_validation.reason ?? 'Invalid policy parameters',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const success = await this.leavePolicyRepository.update(
          id,
          policy,
          manager,
        );
        if (!success) {
          throw new LeavePolicyBusinessException(
            'Leave policy update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated = await this.leavePolicyRepository.findById(id, manager);
        const after_state = extractEntityState(updated, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: LEAVE_POLICY_ACTIONS.UPDATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES,
          details: JSON.stringify({
            id: updated?.id,
            changed_fields,
            updated_by: requestInfo?.user_name ?? '',
            updated_at: getPHDateTime(updated?.updated_at ?? new Date()),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated;
      },
    );
  }
}
