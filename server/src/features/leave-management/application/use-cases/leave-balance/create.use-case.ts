import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import {
  LeaveBalanceRepository,
  LeavePolicyRepository,
} from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { CreateLeaveBalanceCommand } from '../../commands/leave-balance/create.command';
import { EnumLeaveBalanceStatus } from '@/features/leave-management/domain/enum';
import {
  EmployeeRepository,
  LeaveTypeRepository,
} from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import { toNumber } from '@/core/utils/coercion.util';

@Injectable()
export class CreateLeaveBalanceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly policyRepository: LeavePolicyRepository,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    command: CreateLeaveBalanceCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveBalance> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.CREATE,
      async (manager) => {
        const policy = await this.policyRepository.findById(
          command.policy_id,
          manager,
        );
        if (!policy) {
          throw new LeaveBalanceBusinessException(
            'Policy not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        const leave_type = await this.leaveTypeRepository.findById(
          policy.leave_type_id,
          manager,
        );
        if (!leave_type || leave_type.deleted_at) {
          throw new LeaveBalanceBusinessException(
            'Leave type not found or archived',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        const employee = await this.employeeRepository.findById(
          command.employee_id,
          manager,
        );
        if (!employee || employee.deleted_at) {
          throw new LeaveBalanceBusinessException(
            'Employee not found or archived',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const annual_entitlement = toNumber(policy.annual_entitlement);

        // New balance at year start: opening 0, earned from policy, no use/carry/encash yet
        const entity = LeaveBalance.create({
          employee_id: employee.id!,
          leave_type_id: policy.leave_type_id,
          policy_id: policy.id!,
          year: command.year,
          beginning_balance: 0,
          earned: annual_entitlement,
          used: 0,
          carried_over: 0,
          encashed: 0,
          remaining: annual_entitlement,
          status: EnumLeaveBalanceStatus.OPEN,
          remarks: command.remarks ?? undefined,
          created_by: requestInfo?.user_name ?? null,
        });

        const created = await this.repo.create(entity, manager);
        if (!created) {
          throw new LeaveBalanceBusinessException(
            'Leave balance creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_BALANCE_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
          details: JSON.stringify({
            id: created.id,
            employee_id: employee.id!,
            employee_name: employee.first_name + ' ' + employee.last_name,
            leave_type_id: created.leave_type_id,
            leave_type: leave_type.name,
            year: created.year,
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
