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
  LeaveYearConfigurationRepository,
} from '@/features/leave-management/domain/repositories';
import { LeavePolicy } from '@/features/leave-management/domain/models/leave-policy.model';
import {
  DAY_NAMES,
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { CreateLeaveRequestCommand } from '../../commands/leave-request/create.command';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';
import {
  isSameCalendarDay,
  getCalendarDaysInclusive,
  formatDate,
} from '@/core/utils/date.util';
import { toDate } from '@/core/utils/coercion.util';
import {
  LeaveTypeRepository,
  HolidayRepository,
  EmployeeRepository,
} from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import type { Holiday } from '@/features/shared-domain/domain/models/holiday.model';

/** Detail about excluded weekdays found in a date range (for validation errors). */
export interface ExcludedWeekdayDetailCreate {
  /** First weekday number found (0=Sunday, ..., 6=Saturday) for DAY_NAMES. */
  firstExcludedDay: number;
  /** All dates in the range that fall on excluded weekdays. */
  excludedDates: Date[];
}

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
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly leaveYearConfigurationRepository: LeaveYearConfigurationRepository,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(SHARED_DOMAIN_TOKENS.HOLIDAY)
    private readonly holidayRepository: HolidayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) { }

  async execute(
    command: CreateLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveRequest> {
    const employee_id = Number(command.employee_id);
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
    const is_same_day = isSameCalendarDay(start_date, end_date);
    if (is_half_day && !is_same_day) {
      throw new LeaveRequestBusinessException(
        'Half-day leave requires start date and end date to be the same',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.CREATE,
      async (manager) => {
        const employee = await this.employeeRepository.findById(
          employee_id,
          manager,
        );
        if (!employee || employee.deleted_at) {
          throw new LeaveRequestBusinessException(
            'Employee not found or archived',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        const employee_name = employee.first_name + ' ' + employee.last_name;
        /**
         * Validate that the leave type is valid and not archived.
         */
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

        /** Validate that the leave period does not include excluded weekdays. */
        const excluded_weekdays = policy.excluded_weekdays ?? [];
        if (excluded_weekdays.length > 0) {
          const excluded_detail = this.getExcludedWeekdayDetailsInRange(
            start_date,
            end_date,
            excluded_weekdays,
          );
          if (excluded_detail !== null) {
            const day_name = DAY_NAMES[excluded_detail.firstExcludedDay];
            const dates_str =
              excluded_detail.excludedDates.length > 0
                ? ` (${excluded_detail.excludedDates.map((d) => formatDate(d)).join(', ')})`
                : '';
            throw new LeaveRequestBusinessException(
              `Cannot file leave on excluded weekdays. The selected date range includes ${day_name}${dates_str}, which is excluded by the leave policy.`,
              HTTP_STATUS.BAD_REQUEST,
            );
          }
        }

        /**
         * Calculate total days between start and end (inclusive), excluding holidays and policy excluded_weekdays.
         */
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

        /**
         * Validate that the total days is greater than 0.
         */
        if (total_days <= 0) {
          const calendar_days = getCalendarDaysInclusive(start_date, end_date);
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

        /**
         * Resolve leave year for start date, then find balance by employee, leave type, and year.
         */
        const yearConfig =
          await this.leaveYearConfigurationRepository.findActiveForDate(
            start_date,
            manager,
          );
        if (!yearConfig) {
          throw new LeaveRequestBusinessException(
            'No leave year configuration found for the selected start date',
            HTTP_STATUS.BAD_REQUEST,
          );
        }
        const year = yearConfig.year;
        const balance = await this.leaveBalanceRepository.loadEmployeeBalancesByLeaveTypeAndYear(
          employee_id,
          policy.leave_type_id,
          year,
          manager,
        );
        if (!balance || balance.id == null) {
          throw new LeaveRequestBusinessException(
            'Leave balance not found for this employee, leave type, and leave year',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        const balance_id = balance.id;
        /**
         * Validate that the balance is sufficient.
         */
        const request = LeaveRequest.create({
          employee_id,
          leave_type_id: policy.leave_type_id,
          start_date,
          end_date,
          total_days,
          reason: command.reason,
          balance_id,
          remarks: command.remarks,
          created_by: requestInfo?.user_name ?? null,
        });
        request.assertBalanceSufficient(balance);

        /**
         * Validate that there are no overlapping leave requests (only PENDING/APPROVED block; REJECTED/CANCELLED do not).
         *
         * Future: If half-day "slots" (e.g. AM vs PM on the same day) are supported, overlap logic should allow
         * two half-days on the same day when slots differ. With the current "same date range = one request" rule,
         * the logic is correct as-is.
         */
        const overlapping =
          await this.leaveRequestRepository.findOverlappingRequests(
            employee_id,
            start_date,
            end_date,
            manager,
            undefined,
          );
        const blocking = overlapping.filter(
          (r) =>
            r.status === EnumLeaveRequestStatus.PENDING ||
            r.status === EnumLeaveRequestStatus.APPROVED,
        );
        if (blocking.length > 0) {
          const dateRanges = blocking
            .map(
              (r) => `${formatDate(r.start_date)} – ${formatDate(r.end_date)}`,
            )
            .join('; ');
          throw new LeaveRequestBusinessException(
            `Overlapping leave request exists for this period. Conflicting request(s): ${dateRanges}.`,
            HTTP_STATUS.CONFLICT,
          );
        }

        /**
         * Create the leave request.
         */
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
            employee_id: employee.id!,
            employee_name: employee_name,
            leave_type_id: created.leave_type_id,
            leave_type: created.leave_type,
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

  /**
   * Converts command input (string, number, or Date) to a valid Date for start_date/end_date.
   * Uses core toDate() for conversion; throws domain exception with label for required/invalid.
   *
   * Process:
   * 1. If value is null/undefined, throw "label is required".
   * 2. Call toDate(value); if null (invalid), throw "Invalid label".
   * 3. Return the Date.
   */
  private normalizeDate(value: unknown, label: string): Date {
    if (value == null) {
      throw new LeaveRequestBusinessException(
        `${label} is required`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const d = toDate(value);
    if (d === undefined) {
      throw new LeaveRequestBusinessException(
        `Invalid ${label.toLowerCase()}`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return d;
  }

  /**
   * Ensures the leave period is valid: start date must be on or before end date.
   * Compares date-only (no time) by building midnight dates from year/month/day.
   */
  private validateDates(start_date: Date, end_date: Date): void {
    const startDay = new Date(
      start_date.getFullYear(),
      start_date.getMonth(),
      start_date.getDate(),
    ).getTime();
    const endDay = new Date(
      end_date.getFullYear(),
      end_date.getMonth(),
      end_date.getDate(),
    ).getTime();
    if (startDay > endDay) {
      throw new LeaveRequestBusinessException(
        'Start date must be before or equal to end date',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  /**
   * Calculates the number of leave days in a date range: calendar days minus holidays and policy excluded weekdays.
   * Used to set total_days on a leave request (full-day leave). Half-day leave uses 0.5 and does not call this.
   *
   * Process:
   * 1. Normalize start and end to midnight for consistent day counting.
   * 2. Get calendar days in range (inclusive) via getCalendarDaysInclusive.
   * 3. Load holidays in the range from HolidayRepository.findByDateRange.
   * 4. Count excluded weekdays in the range (policy.excluded_weekdays); days that are holidays are not counted to avoid double-counting.
   * 5. total_days = max(0, calendar_days - holidays.length - excluded_weekday_count).
   * 6. Return { total_days, holidays } for the caller (holidays may be used for display or validation).
   *
   * @param start_date - Start date of the leave period
   * @param end_date - End date of the leave period
   * @param policy - Leave policy (provides excluded_weekdays)
   * @param manager - Transaction or connection for repository calls
   * @returns Object with total_days (business days in range) and holidays (array of holidays in range)
   */
  private async calculateTotalDaysWithHolidays(
    start_date: Date,
    end_date: Date,
    policy: LeavePolicy,
    manager: unknown,
  ): Promise<{ total_days: number; holidays: Holiday[] }> {
    const calendar_days = getCalendarDaysInclusive(start_date, end_date);
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
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
    while (current <= end_date) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        const is_holiday = holidays.some((h) => {
          const holidayDate = toDate(h.date);
          return (
            holidayDate !== undefined && isSameCalendarDay(holidayDate, current)
          );
        });
        if (!is_holiday) count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  /**
   * Returns detailed info about excluded weekdays in the date range, or null if none.
   * Sunday = 0; validation correctly handles 0 in excluded_weekdays.
   *
   * @returns Object with firstExcludedDay (0-6) and excludedDates (all dates in range on excluded weekdays), or null
   */
  private getExcludedWeekdayDetailsInRange(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
  ): ExcludedWeekdayDetailCreate | null {
    if (!excluded_weekdays.length) return null;
    const excludedDates: Date[] = [];
    let firstExcludedDay: number | null = null;
    const current = new Date(start_date);
    while (current <= end_date) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        excludedDates.push(new Date(current));
        if (firstExcludedDay === null) firstExcludedDay = day;
      }
      current.setDate(current.getDate() + 1);
    }
    if (firstExcludedDay === null) return null;
    return { firstExcludedDay, excludedDates };
  }
}
