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
import type { GenerateBalancesForYearEntry } from '@/features/leave-management/application/commands/leave-balance/generate-balances-for-year.command';
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
  ) {}

  async execute(
    year: string,
    entries: GenerateBalancesForYearEntry[],
    context: unknown,
    requestInfo?: RequestInfo,
  ): Promise<{ created_count: number; skipped_count: number }> {
    let created_count = 0;
    let skipped_count = 0;

    for (const entry of entries) {
      const employee_id = toNumber(entry.employee_id, -1);
      const leave_type_id = toNumber(entry.leave_type_id, -1);
      if (employee_id < 0 || leave_type_id < 0) continue;

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

      const beginning_balance = toNumber(entry.beginning_balance);
      const earned = toNumber(entry.earned);
      const used = toNumber(entry.used);
      const carried_over = toNumber(entry.carried_over);
      const encashed = toNumber(entry.encashed);
      const remaining =
        entry.remaining !== undefined && entry.remaining !== null
          ? toNumber(entry.remaining)
          : beginning_balance + earned - used + carried_over - encashed;
      const policy_id = toNumber(entry.policy_id, -1);
      if (policy_id < 0) continue;

      const entity = LeaveBalance.create({
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

      const created = await this.repo.create(entity, context);
      if (created) created_count += 1;
    }

    const log = ActivityLog.create({
      action: LEAVE_BALANCE_ACTIONS.GENERATE_BALANCES_FOR_YEAR,
      entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES,
      details: JSON.stringify({
        year,
        created_count,
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
