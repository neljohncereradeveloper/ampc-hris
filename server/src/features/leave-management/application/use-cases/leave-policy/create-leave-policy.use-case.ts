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
import { CreateLeavePolicyCommand } from '../../commands/leave-policy/create-leave-policy.command';
import { EnumLeavePolicyStatus } from '@/features/leave-management/domain/enum';
import { PolicyActivationService } from '@/features/leave-management/domain/services';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';

@Injectable()
export class CreateLeavePolicyUseCase {
  private readonly activation_service = new PolicyActivationService();

  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateLeavePolicyCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeavePolicy> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.CREATE,
      async (manager) => {
        const leave_type = await this.leaveTypeRepository.findById(
          command.leave_type_id,
          manager,
        );
        if (!leave_type || leave_type.deleted_at) {
          throw new LeavePolicyBusinessException(
            'Leave type not found or archived',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const policy = LeavePolicy.create({
          leave_type_id: command.leave_type_id,
          annual_entitlement: command.annual_entitlement,
          carry_limit: command.carry_limit,
          encash_limit: command.encash_limit,
          carried_over_years: command.carried_over_years,
          effective_date: command.effective_date,
          expiry_date: command.expiry_date,
          status: EnumLeavePolicyStatus.DRAFT,
          remarks: command.remarks,
          minimum_service_months: command.minimum_service_months,
          allowed_employment_types: command.allowed_employment_types,
          allowed_employee_statuses: command.allowed_employee_statuses,
          excluded_weekdays: command.excluded_weekdays,
          created_by: requestInfo?.user_name ?? null,
        });

        const parameter_validation =
          this.activation_service.validatePolicyParameters(policy);
        if (!parameter_validation.isValid) {
          throw new LeavePolicyBusinessException(
            parameter_validation.reason ?? 'Invalid policy parameters',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const created = await this.leavePolicyRepository.create(policy, manager);
        if (!created) {
          throw new LeavePolicyBusinessException(
            'Leave policy creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_POLICY_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES,
          details: JSON.stringify({
            id: created.id,
            leave_type_id: created.leave_type_id,
            created_by: requestInfo?.user_name ?? '',
            created_at: getPHDateTime(created.created_at),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created;
      },
    );
  }
}
