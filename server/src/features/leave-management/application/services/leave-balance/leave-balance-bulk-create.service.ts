import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import { EnumLeaveBalanceStatus } from '@/features/leave-management/domain/enum';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';
import type { GenerateBalancesForYearEntry } from '@/features/leave-management/application/commands/leave-balance/generate-for-year.command';
import { toNumber } from '@/core/utils/coercion.util';

/**
 * Application-level service: creates leave balances from entries (create-or-skip) and writes one activity log.
 * Does not start a transaction; callers pass the manager so it participates in their transaction.
 * Used by GenerateBalancesForYearUseCase and GenerateBalancesForAllEmployeesUseCase so they do not depend on each other.
 */
@Injectable()
export class LeaveBalanceBulkCreateService {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    year: string,
    entries: GenerateBalancesForYearEntry[],
    context: unknown,
    requestInfo?: RequestInfo,
  ): Promise<{ created_count: number; skipped_count: number }> {
    let created_count = 0;
    let skipped_count = 0;
    let data: LeaveBalance[] = [];

    for (const entry of entries) {
      const employee_id = toNumber(entry.employee_id, -1);
      if (employee_id < 0) continue;
      const leave_type_id = toNumber(entry.leave_type_id, -1);
      const policy_id = toNumber(entry.policy_id, -1);
      const annual_entitlement = toNumber(entry.annual_entitlement, 0);

      const existing = await this.repo.findByLeaveType(
        employee_id,
        leave_type_id,
        year,
        context,
      );
      if (existing) {
        skipped_count += 1;
        continue;
      }

      const beginning_balance = 0;
      const earned = annual_entitlement;
      const used = 0;
      const carried_over = 0;
      const encashed = 0;
      const remaining = annual_entitlement;

      const balance = LeaveBalance.create({
        employee_id,
        leave_type_id,
        policy_id,
        year,
        beginning_balance,
        earned,
        used,
        carried_over,
        encashed,
        remaining,
        status: EnumLeaveBalanceStatus.OPEN,
        remarks: entry.remarks,
        created_by: requestInfo?.user_name ?? null,
      });

      const created = await this.repo.create(balance, context);
      if (created) created_count += 1;
      data.push(balance);
    }

    const log = ActivityLog.create({
      action: LEAVE_BALANCE_ACTIONS.GENERATE_BALANCES_FOR_YEAR,
      entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
      details: JSON.stringify({
        year,
        created_count,
        data,
        skipped_count,
        generated_by: requestInfo?.user_name ?? '',
        generated_at: getPHDateTime(new Date()),
      }),
      request_info: requestInfo ?? { user_name: '' },
    });
    await this.activityLogRepository.create(log, context);

    return { created_count, skipped_count };
  }
}
