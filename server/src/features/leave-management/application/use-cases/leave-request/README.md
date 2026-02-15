# Leave Request Use Cases

Documentation for all leave-request application use cases: create, update, get by id, paginated list (all / by employee / pending), approve, reject, and cancel.

---

## Table of Contents

1. [Overview](#overview)
2. [Status Lifecycle](#status-lifecycle)
3. [Domain & Validation](#domain--validation)
4. [Use Cases](#use-cases)
5. [Commands & Types](#commands--types)
6. [Dependencies](#dependencies)

---

## Overview

Leave requests represent an employee’s application for leave (e.g. vacation, sick leave). Each request is tied to an employee, leave type, date range, and leave balance. Total days are calculated from the date range (excluding holidays and policy excluded weekdays), or set to 0.5 for half-day leave. Only **PENDING** requests can be updated; approval debits the balance and creates a transaction; rejection or cancellation of PENDING has no balance impact; cancelling an **APPROVED** request restores balance and creates a reversing transaction.

| Use Case | Purpose |
|----------|--------|
| **CreateLeaveRequestUseCase** | Submit a new leave request (employee, leave type, dates, reason). Validates employee, leave type, policy, excluded weekdays, total days, balance sufficiency, and overlapping requests. |
| **UpdateLeaveRequestUseCase** | Update a PENDING request (dates, reason, remarks). Re-validates dates, policy, balance, and overlaps when dates change. |
| **GetLeaveRequestByIdUseCase** | Get one leave request by id. |
| **GetPaginatedLeaveRequestUseCase** | List all leave requests with search term, pagination, and archive filter. |
| **GetPaginatedLeaveRequestByEmployeeUseCase** | List leave requests for a single employee with search and pagination. |
| **GetPaginatedPendingLeaveRequestsUseCase** | List only PENDING leave requests with search and pagination (e.g. approver dashboard). |
| **ApproveLeaveRequestUseCase** | Approve a PENDING request: debit balance, create REQUEST transaction, set status to APPROVED. Requires authenticated user (RequestInfo.user_id). |
| **RejectLeaveRequestUseCase** | Reject a PENDING request: set status to REJECTED, no balance change. Requires authenticated user. |
| **CancelLeaveRequestUseCase** | Cancel a PENDING or APPROVED request. If APPROVED, restore balance and create reversing transaction; set status to CANCELLED. Requires authenticated user. |

---

## Status Lifecycle

```
                    ┌─────────────┐
                    │   PENDING   │  ← Only status that can be updated
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
  │  APPROVED   │   │  REJECTED   │   │  CANCELLED   │
  │ (balance    │   │ (no balance │   │ (if was     │
  │  debited)   │   │  change)    │   │  APPROVED,   │
  └──────┬──────┘   └─────────────┘   │  balance     │
         │                             │  restored)   │
         │                             └─────────────┘
         └──────────────► CANCELLED (reverse balance)
```

- **PENDING:** Awaiting approval or rejection. Only PENDING requests can be updated (dates, reason, remarks).
- **APPROVED:** Balance has been debited; a leave transaction (type REQUEST, negative days) exists. Can be cancelled (balance restored, reversing transaction).
- **REJECTED:** No balance change. Terminal.
- **CANCELLED:** If the request was APPROVED, balance is restored and a reversing transaction is created. Terminal.

---

## Domain & Validation

### LeaveRequest (domain model)

- **create():** Builds request with employee_id, leave_type_id, start_date, end_date, total_days, reason, balance_id, remarks, created_by. No status set (persistence defaults to PENDING).
- **assertBalanceSufficient(balance):** Throws if balance.remaining &lt; total_days or balance is not OPEN.
- **update():** Accepts partial fields (start_date, end_date, total_days, reason, remarks, updated_by). Only valid when status is PENDING (enforced in use case before calling).

### Create / update validation flow

1. **Pre-transaction:** Normalize start_date/end_date (toDate), validate start ≤ end, half-day requires same start/end day.
2. **In transaction:**  
   - Employee exists and not archived.  
   - Leave type exists (by code), not archived.  
   - Active policy for leave type.  
   - Date range does not include policy excluded weekdays.  
   - Total days: 0.5 for half-day same-day; otherwise calendar days − holidays − excluded weekdays; must be &gt; 0.  
   - Leave year config for start date; balance by employee + leave type + year; assert balance sufficient.  
   - No overlapping PENDING/APPROVED requests for same employee (findOverlappingRequests; on update, exclude current request id).

### Overlap rule

Overlapping is determined by date range. Only **PENDING** and **APPROVED** requests block; REJECTED and CANCELLED do not. If half-day “slots” (e.g. AM/PM) are added later, overlap logic may allow two half-days on the same day when slots differ.

---

## Use Cases

### 1. CreateLeaveRequestUseCase

**Purpose:** Submit a new leave request. Validates employee, leave type, active policy, excluded weekdays, total days (including holidays), balance sufficiency, and overlapping requests. Creates request with status PENDING and logs the action.

**Input:** `CreateLeaveRequestCommand` (employee_id, leave_type_code, start_date, end_date, is_half_day?, reason, remarks?), optional `RequestInfo`.

**Process:**

1. Validate leave_type_code non-empty; normalize start_date/end_date; validate start ≤ end; validate half-day only when start and end are same day.
2. Run in transaction.
3. Load employee; throw if not found or archived.
4. Load leave type by code; throw if not found or archived.
5. Load active policy for leave type; throw if none.
6. Validate date range does not include policy excluded weekdays (detailed error with day names and dates).
7. Compute total_days: 0.5 if half-day same-day; else calendar days − holidays − excluded weekdays. Throw if total_days ≤ 0 (with specific message if all dates are holidays).
8. Resolve leave year (findActiveForDate(start_date)); find balance by employee, leave type, year; throw if no balance.
9. Build `LeaveRequest.create({ ... })` and call `request.assertBalanceSufficient(balance)`.
10. Find overlapping PENDING/APPROVED requests; throw if any (with conflicting date ranges in message).
11. Persist: `LeaveRequestRepository.create(request, manager)`. Throw if create fails.
12. Activity log: CREATE with id, employee_id, employee_name, leave_type_id, total_days, created_by, created_at.
13. Return created request.

**Errors:** 400 (validation, insufficient balance, excluded weekdays, zero days, overlap), 404 (employee/leave type/policy/balance not found), 409 (overlap), 500 (create failed).

---

### 2. UpdateLeaveRequestUseCase

**Purpose:** Update a PENDING leave request (dates, total_days, reason, remarks). When dates change, re-runs policy, excluded weekdays, total days, balance check, and overlap check. Logs only changed fields.

**Input:** `id: number`, `UpdateLeaveRequestCommand` (start_date?, end_date?, is_half_day?, reason?, remarks?), optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. Load request by id; throw if not found. Throw if status is not PENDING.
3. Resolve employee name for activity log.
4. Capture before state for change tracking (start_date, end_date, total_days, reason, updated_at, updated_by).
5. If command provides start_date or end_date: normalize dates, validate start ≤ end, validate half-day same-day; load policy; validate excluded weekdays; compute total_days (0.5 or calendar − holidays − excluded); validate total_days &gt; 0; if total_days changed, validate balance exists, OPEN, and sufficient; find overlapping PENDING/APPROVED excluding current id, throw if any.
6. Call `existing_request.update({ ... })` with updated fields.
7. Persist: `LeaveRequestRepository.update(id, existing_request, manager)`. Throw if update fails.
8. Reload request; compute after state; get changed fields via getChangedFields(before, after).
9. Activity log: UPDATE with id, employee_id, employee_name, leave_type_id, total_days, changed_fields, updated_by, updated_at.
10. Return updated request.

**Errors:** 400 (validation, excluded weekdays, zero days, balance insufficient/closed), 404 (request/balance not found), 409 (not PENDING, overlap), 500 (update failed).

---

### 3. GetLeaveRequestByIdUseCase

**Purpose:** Get a single leave request by id.

**Input:** `id: number`.

**Process:** Run in transaction; call `LeaveRequestRepository.findById(id, manager)`; return request or `null`.

**Returns:** `LeaveRequest | null`.

---

### 4. GetPaginatedLeaveRequestUseCase

**Purpose:** List all leave requests with search term, pagination, and archive filter.

**Input:** `term: string`, `page: number`, `limit: number`, `is_archived: boolean`.

**Process:** Normalize page (default 1) and limit (default 10); run in transaction; call `LeaveRequestRepository.findPaginatedList(term, page, limit, is_archived, manager)`; return result.

**Returns:** `PaginatedResult<LeaveRequest>`.

---

### 5. GetPaginatedLeaveRequestByEmployeeUseCase

**Purpose:** List leave requests for one employee with search and pagination.

**Input:** `employee_id: number`, `term: string`, `page: number`, `limit: number`, `is_archived: boolean`.

**Process:** Normalize employee_id, page, limit; run in transaction; call `LeaveRequestRepository.findPaginatedByEmployee(employee_id, term, page, limit, is_archived, manager)`; return result.

**Returns:** `PaginatedResult<LeaveRequest>`.

---

### 6. GetPaginatedPendingLeaveRequestsUseCase

**Purpose:** List only PENDING leave requests with search and pagination (e.g. for approver dashboard).

**Input:** `term: string`, `page: number`, `limit: number`.

**Process:** Normalize page and limit; run in transaction; call `LeaveRequestRepository.findPaginatedPending(term, page, limit, manager)`; return result.

**Returns:** `PaginatedResult<LeaveRequest>`.

---

### 7. ApproveLeaveRequestUseCase

**Purpose:** Approve a PENDING leave request: debit balance (used += total_days, remaining −= total_days), create LeaveTransaction (type REQUEST, negative days), set request status to APPROVED. Requires authenticated user (RequestInfo.user_id).

**Input:** `id: number`, `ApproveLeaveRequestCommand` (remarks?), optional `RequestInfo`.

**Process:**

1. Validate RequestInfo.user_id present; throw 401 if not.
2. Run in transaction.
3. Load request by id; throw if not found. Throw if status is not PENDING.
4. Load balance by request.balance_id; throw if not found or not OPEN; re-validate remaining ≥ request.total_days.
5. Update balance: used += total_days, remaining −= total_days; persist balance.
6. Create LeaveTransaction (type REQUEST, days = −total_days, balance_id, remarks, user_id); persist.
7. Call `LeaveRequestRepository.updateStatus(id, APPROVED, user_id, command.remarks ?? '', manager)`.
8. Activity log: APPROVE with id, employee_id, leave_type_id, total_days, approved_by, approved_at.
9. Return `true`.

**Errors:** 401 (user_id missing), 404 (request/balance not found), 400 (balance closed or insufficient), 409 (not PENDING), 500 (persist failure).

---

### 8. RejectLeaveRequestUseCase

**Purpose:** Reject a PENDING leave request: set status to REJECTED, no balance or transaction change. Requires authenticated user.

**Input:** `id: number`, `RejectLeaveRequestCommand` (remarks?), optional `RequestInfo`.

**Process:**

1. Validate RequestInfo.user_id present; throw 401 if not.
2. Run in transaction.
3. Load request by id; throw if not found. Throw if status is not PENDING.
4. Call `LeaveRequestRepository.updateStatus(id, REJECTED, user_id, command.remarks ?? '', manager)`.
5. Activity log: REJECT with id, employee_id, rejected_by, rejected_at.
6. Return `true`.

**Errors:** 401 (user_id missing), 404 (request not found), 409 (not PENDING), 500 (update failed).

---

### 9. CancelLeaveRequestUseCase

**Purpose:** Cancel a PENDING or APPROVED leave request. If PENDING: set status to CANCELLED only. If APPROVED: restore balance (used −= total_days, remaining += total_days), create reversing LeaveTransaction (type REQUEST, positive days), set status to CANCELLED. Requires authenticated user.

**Input:** `id: number`, `CancelLeaveRequestCommand` (remarks?), optional `RequestInfo`.

**Process:**

1. Validate RequestInfo.user_id present; throw 401 if not.
2. Run in transaction.
3. Load request by id; throw if not found. Throw if status is not PENDING and not APPROVED.
4. If status is APPROVED: load balance; restore used and remaining; persist balance; create reversing transaction (positive days); persist.
5. Call `LeaveRequestRepository.updateStatus(id, CANCELLED, user_id, command.remarks ?? '', manager)`.
6. Activity log: CANCEL with id, employee_id, cancelled_by, cancelled_at.
7. Return `true`.

**Errors:** 401 (user_id missing), 404 (request/balance not found), 409 (not PENDING or APPROVED), 500 (persist failure).

---

## Commands & Types

| Command | Description |
|---------|-------------|
| **CreateLeaveRequestCommand** | `employee_id`, `leave_type_code`, `start_date`, `end_date`, `is_half_day?`, `reason`, `remarks?`. |
| **UpdateLeaveRequestCommand** | `start_date?`, `end_date?`, `is_half_day?`, `reason?`, `balance_id?`, `remarks?`. Only applied when request is PENDING. |
| **ApproveLeaveRequestCommand** | `remarks?`. Approver taken from RequestInfo.user_id. |
| **RejectLeaveRequestCommand** | `remarks?`. Rejector taken from RequestInfo.user_id. |
| **CancelLeaveRequestCommand** | `remarks?`. Canceller taken from RequestInfo.user_id. |

**ExcludedWeekdayDetail** (exported from create/update use case): `firstExcludedDay` (0–6), `excludedDates` (Date[]) — used for validation error messages when the date range includes policy excluded weekdays.

---

## Dependencies

| Dependency | Token / Source | Used by |
|------------|----------------|--------|
| **LeaveRequestRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST` | All use cases |
| **LeaveBalanceRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE` | Create, Update (when total_days changed), Approve, Cancel |
| **LeavePolicyRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY` | Create, Update (when dates changed) |
| **LeaveYearConfigurationRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION` | Create |
| **LeaveTransactionRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_TRANSACTION` | Approve, Cancel |
| **LeaveTypeRepository** | `SHARED_DOMAIN_TOKENS.LEAVE_TYPE` | Create |
| **HolidayRepository** | `SHARED_DOMAIN_TOKENS.HOLIDAY` | Create, Update |
| **EmployeeRepository** | `SHARED_DOMAIN_TOKENS.EMPLOYEE` | Create, Update (for activity log) |
| **TransactionPort** | `TOKENS_CORE.TRANSACTIONPORT` | All use cases |
| **ActivityLogRepository** | `TOKENS_CORE.ACTIVITYLOGS` | Create, Update, Approve, Reject, Cancel |

Activity log **actions** are in `domain/constants/leave-request.constants.ts` (`LEAVE_REQUEST_ACTIONS`). Entity name for logs is `LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS` (`'leave_requests'`).

**Repository methods used:** create, update, findById, findPaginatedList, findPaginatedByEmployee, findPaginatedPending, findOverlappingRequests, updateStatus; LeaveBalanceRepository.findById, findByLeaveType; LeaveYearConfigurationRepository.findActiveForDate.
