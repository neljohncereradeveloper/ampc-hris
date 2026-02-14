import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveRequest } from '@/features/leave-management/domain/models';
import {
  LeaveRequestRepository,
  LeaveBalanceRepository,
  LeavePolicyRepository,
} from '@/features/leave-management/domain/repositories';
import { LeavePolicy } from '@/features/leave-management/domain/models/leave-policy.model';
import {
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { CreateLeaveRequestCommand } from '../../commands/leave-request/create-leave-request.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';
import {
  LeaveTypeRepository,
  HolidayRepository,
} from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import type { Holiday } from '@/features/shared-domain/domain/models/holiday.model';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

@Injectable()
export class CreateLeaveRequestUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(SHARED_DOMAIN_TOKENS.HOLIDAY)
    private readonly holidayRepository: HolidayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveRequest> {
    const employee_id = Number(command.employee_id);
    const balance_id = Number(command.balance_id);
    const leave_type_code =
      typeof command.leave_type_code === 'string'
        ? command.leave_type_code.trim()
        : String(command.leave_type_code ?? '').trim();
    if (!leave_type_code) {
      throw new LeaveRequestBusinessException(
        'Leave type code is required',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const start_date = this.normalizeDate(command.start_date, 'Start date');
    const end_date = this.normalizeDate(command.end_date, 'End date');
    this.validateDates(start_date, end_date);

    const is_half_day = Boolean(command.is_half_day);
    const is_same_day =
      start_date.toDateString() === end_date.toDateString();
    if (is_half_day && !is_same_day) {
      throw new LeaveRequestBusinessException(
        'Half-day leave requires start date and end date to be the same',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.CREATE,
      async (manager) => {
        const leave_type = await this.leaveTypeRepository.findByCode(
          leave_type_code,
          manager,
        );
        if (!leave_type || leave_type.deleted_at) {
          throw new LeaveRequestBusinessException(
            'Leave type not found or archived',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        const leave_type_id = Number(leave_type.id);

        const policy = await this.leavePolicyRepository.getActivePolicy(
          leave_type_id,
          manager,
        );
        if (!policy) {
          throw new LeaveRequestBusinessException(
            `Active leave policy not found for leave type "${leave_type_code}"`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const excluded_weekdays = policy.excluded_weekdays ?? [];
        if (excluded_weekdays.length > 0) {
          const has_excluded = this.hasExcludedWeekday(
            start_date,
            end_date,
            excluded_weekdays,
          );
          if (has_excluded) {
            const day_of_week = start_date.getDay();
            throw new LeaveRequestBusinessException(
              `Cannot file leave on excluded weekdays. The selected date range includes ${DAY_NAMES[day_of_week]} which is excluded by the leave policy.`,
              HTTP_STATUS.BAD_REQUEST,
            );
          }
        }

        let total_days: number;
        let holidays: Holiday[] = [];

        if (is_half_day && is_same_day) {
          total_days = 0.5;
          holidays = await this.holidayRepository.findByDateRange(
            start_date,
            end_date,
            manager,
          );
        } else {
          const result = await this.calculateTotalDaysWithHolidays(
            start_date,
            end_date,
            policy,
            manager,
          );
          total_days = result.total_days;
          holidays = result.holidays;
        }

        if (total_days <= 0) {
          const calendar_days = this.getCalendarDays(start_date, end_date);
          if (holidays.length >= calendar_days) {
            throw new LeaveRequestBusinessException(
              'All dates in the leave request period are holidays. Cannot create leave request for holiday dates only.',
              HTTP_STATUS.BAD_REQUEST,
            );
          }
          throw new LeaveRequestBusinessException(
            'Invalid date range: total days must be greater than 0. The selected dates may fall on holidays or excluded weekdays.',
            HTTP_STATUS.BAD_REQUEST,
          );
        }

        const balance = await this.leaveBalanceRepository.findById(
          balance_id,
          manager,
        );
        if (!balance) {
          throw new LeaveRequestBusinessException(
            'Leave balance not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const request = LeaveRequest.create({
          employee_id,
          leave_type_id,
          start_date,
          end_date,
          total_days,
          reason: command.reason,
          balance_id,
          remarks: command.remarks,
          created_by: requestInfo?.user_name ?? null,
        });

        request.assertBalanceSufficient(balance);

        const overlapping = await this.leaveRequestRepository.findOverlappingRequests(
          employee_id,
          start_date,
          end_date,
          manager,
          undefined,
        );
        const has_overlap = overlapping.some(
          (r) =>
            r.status === EnumLeaveRequestStatus.PENDING ||
            r.status === EnumLeaveRequestStatus.APPROVED,
        );
        if (has_overlap) {
          throw new LeaveRequestBusinessException(
            'Overlapping leave request exists for this period.',
            HTTP_STATUS.CONFLICT,
          );
        }

        const created = await this.leaveRequestRepository.create(
          request,
          manager,
        );
        if (!created) {
          throw new LeaveRequestBusinessException(
            'Leave request creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.CREATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: created.id,
            employee_id: created.employee_id,
            leave_type_id: created.leave_type_id,
            total_days: created.total_days,
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

  private normalizeDate(value: unknown, label: string): Date {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new LeaveRequestBusinessException(
          `Invalid ${label.toLowerCase()}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      return value;
    }
    if (value != null) {
      const d = new Date(value as string | number);
      if (Number.isNaN(d.getTime())) {
        throw new LeaveRequestBusinessException(
          `Invalid ${label.toLowerCase()}`,
          HTTP_STATUS.BAD_REQUEST,
        );
      }
      return d;
    }
    throw new LeaveRequestBusinessException(
      `${label} is required`,
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  private validateDates(start_date: Date, end_date: Date): void {
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (start.getTime() > end.getTime()) {
      throw new LeaveRequestBusinessException(
        'Start date must be before or equal to end date',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  /**
   * Calculate total days between start and end (inclusive), excluding holidays and policy excluded_weekdays.
   */
  private async calculateTotalDaysWithHolidays(
    start_date: Date,
    end_date: Date,
    policy: LeavePolicy,
    manager: unknown,
  ): Promise<{ total_days: number; holidays: Holiday[] }> {
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const calendar_days = this.getCalendarDays(start, end);
    const holidays = await this.holidayRepository.findByDateRange(
      start,
      end,
      manager,
    );
    const excluded_weekday_count = this.countExcludedWeekdays(
      start,
      end,
      policy.excluded_weekdays ?? [],
      holidays,
    );
    const total_days = Math.max(
      0,
      calendar_days - holidays.length - excluded_weekday_count,
    );
    return { total_days, holidays };
  }

  /**
   * Count excluded weekdays in range. Days that are holidays are not counted to avoid double-counting.
   * @param excluded_weekdays - 0=Sunday, 1=Monday, ..., 6=Saturday
   */
  private countExcludedWeekdays(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
    holidays: Holiday[],
  ): number {
    if (!excluded_weekdays.length) return 0;
    let count = 0;
    const current = new Date(start_date);
    const end = new Date(end_date);
    while (current <= end) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        const is_holiday = holidays.some(
          (h) =>
            new Date(h.date).toDateString() === current.toDateString(),
        );
        if (!is_holiday) count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  private hasExcludedWeekday(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
  ): boolean {
    if (!excluded_weekdays.length) return false;
    const current = new Date(start_date);
    const end = new Date(end_date);
    while (current <= end) {
      if (excluded_weekdays.includes(current.getDay())) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

  private getCalendarDays(start_date: Date, end_date: Date): number {
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff_ms = end.getTime() - start.getTime();
    return Math.ceil(diff_ms / (1000 * 60 * 60 * 24)) + 1;
  }
}
