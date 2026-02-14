# Leave Management Domain Documentation

## Table of Contents

1. [Business Domain Overview](#business-domain-overview)
2. [Domain Entities](#domain-entities)
3. [Entity Relationships](#entity-relationships)
4. [Business Processes](#business-processes)
5. [Business Rules and Invariants](#business-rules-and-invariants)
6. [Status Lifecycles](#status-lifecycles)
7. [Repository Interfaces](#repository-interfaces)
8. [Constants and Enums](#constants-and-enums)
9. [Usage Summary](#usage-summary)

---

## Business Domain Overview

The Leave Management domain manages employee leave entitlements, balances, requests, and encashment. Policies define entitlements and limits; balances track credits per employee, leave type, and leave year; employees submit **leave requests** (approved requests deduct balance and create a transaction); unused leave can be **encashed** within policy limits. **Leave cycles** track multi-year carry-over when policies allow it.

### Leave Year System

Leave years are defined by **LeaveYearConfiguration** (cutoff start/end dates and a year label). They do not have to follow the calendar year—e.g. Nov 26 to Nov 25. The **year** field is a string identifier (e.g. `"2023-2024"`) used on balances and in lookups. The system uses **findActiveForDate(date)** to determine which leave year a given date belongs to, so balances and requests are always tied to the correct year.

### Core Concepts

| Concept | Description |
|--------|-------------|
| **LeaveType** | Category of leave (Vacation, Sick, Personal, etc.). Has `name`, `code`, `desc1`, `paid`. |
| **LeavePolicy** | Rules for a leave type: annual entitlement, carry limit, encash limit, carried-over years, effective/expiry dates, eligibility (e.g. minimum service months, allowed employment types/statuses). |
| **LeaveYearConfiguration** | Cutoff period (start/end dates) and year label. Defines leave year boundaries. |
| **LeaveBalance** | Per employee, per leave type, per year. Tracks beginning_balance, earned, used, carried_over, encashed, remaining. |
| **LeaveRequest** | Employee application for leave: dates, total_days, reason, balance_id, status (PENDING → APPROVED/REJECTED/CANCELLED). |
| **LeaveTransaction** | Audit record of every balance change (REQUEST, ENCASHMENT, ADJUSTMENT, CARRY). |
| **LeaveEncashment** | Conversion of leave days to cash; status PENDING → PAID (via mark-as-paid flow only). |
| **LeaveCycle** | Multi-year period for (employee, leave type) to track carry-over within policy cycle. |

---

## Domain Entities

### 1. LeaveType

Category of leave available to employees. **Defined in shared-domain**; leave-management re-exports it for convenience. CRUD and repository are in shared-domain.

**Fields:** `id`, `name`, `code`, `desc1`, `paid`, `remarks`, plus audit fields (`deleted_by`, `deleted_at`, `created_by`, `created_at`, `updated_by`, `updated_at`).

**Business purpose:** Defines the kinds of leave (e.g. VL, SL). Referenced by policies, balances, and requests.

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`.

---

### 2. LeavePolicy

Rules governing leave entitlements for a leave type.

**Fields:** `id`, `leave_type_id`, `leave_type` (denorm), `annual_entitlement`, `carry_limit`, `encash_limit`, `carried_over_years`, `effective_date`, `expiry_date`, `status`, `remarks`, `minimum_service_months`, `allowed_employment_types`, `allowed_employee_statuses`, `excluded_weekdays`, plus audit fields.

**Status values:** DRAFT, ACTIVE, INACTIVE, RETIRED.

**Business purpose:** Defines how many days are granted, how many can be carried or encashed, and eligibility (e.g. `isEmployeeEligible(employee_hire_date, employment_type, employee_status, reference_date)`).

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`, `isEmployeeEligible()`.

---

### 3. LeaveYearConfiguration

Defines the cutoff period and label for a leave year.

**Fields:** `id`, `cutoff_start_date`, `cutoff_end_date`, `year` (e.g. `"2023-2024"`), `remarks`, plus audit fields.

**Business purpose:** Determines which leave year a date falls into. Used when creating balances and when resolving the balance for a leave request. Cutoff end date must be after cutoff start date.

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`.

---

### 4. LeaveBalance

Tracks an employee’s leave credits for a specific leave type and leave year.

**Fields:** `id`, `employee_id`, `leave_type_id`, `leave_type` (denorm), `policy_id`, `year`, `beginning_balance`, `earned`, `used`, `carried_over`, `encashed`, `remaining`, `last_transaction_date`, `status`, `remarks`, plus audit fields.

**Balance formula (enforced in domain):**

```text
remaining = (beginning_balance + earned + carried_over) - (used + encashed)
```

**Status values:** OPEN, CLOSED, REOPENED, FINALIZED.

**Business purpose:** Single source of truth for available leave per (employee, leave type, year). Every deduction (request approval, encashment) or credit (earn, carry, adjustment) must keep this formula valid and should be recorded as a LeaveTransaction.

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`.

---

### 5. LeaveRequest

Employee application for time off.

**Fields:** `id`, `employee_id`, `leave_type_id`, `leave_type` (denorm), `start_date`, `end_date`, `total_days`, `reason`, `balance_id`, `approval_date`, `approval_by`, `remarks`, `status`, plus audit fields.

**Status values:** PENDING, APPROVED, REJECTED, CANCELLED.

**Business purpose:** Represents a request for leave. Created only as PENDING. Balance is deducted only when status becomes APPROVED. Update is allowed only while PENDING.

**Domain methods:** `create()` (no status param; always PENDING), `update()`, `archive()`, `restore()`, `validate()`, `assertBalanceSufficient(balance)`.

**Validation:** `total_days` must be positive and must not exceed the calendar days between `start_date` and `end_date` (inclusive). Before persisting, call `request.assertBalanceSufficient(balance)` (checks balance id/employee/leave type and `balance.remaining >= total_days`).

---

### 6. LeaveTransaction

Audit record of a change to a leave balance.

**Fields:** `id`, `balance_id`, `transaction_type`, `days`, `remarks`, plus audit fields.

**Transaction types and sign:**

| Type       | Meaning              | Sign of `days`   |
|-----------|----------------------|------------------|
| REQUEST   | Leave request approved| Negative (debit) |
| ENCASHMENT| Leave encashed       | Negative (debit) |
| ADJUSTMENT| Manual adjustment    | Any non-zero     |
| CARRY     | Carried from prior year | Positive (credit) |

**Business purpose:** Traceability and reporting. Every balance change should have a corresponding transaction.

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`.

---

### 7. LeaveCycle

Multi-year period for tracking carry-over for (employee, leave type).

**Fields:** `id`, `employee_id`, `leave_type_id`, `leave_type` (denorm), `cycle_start_year`, `cycle_end_year`, `total_carried`, `status`, plus audit fields.

**Status values:** ACTIVE, COMPLETED.

**Business purpose:** Supports policies with `carried_over_years` > 1; tracks how much has been carried within the cycle.

**Domain methods:** `create()`, `update()`, `archive()`, `restore()`, `validate()`.

---

### 8. LeaveEncashment

Conversion of unused leave days to cash.

**Fields:** `id`, `employee_id`, `balance_id`, `total_days`, `amount`, `status`, plus audit fields.

**Status values:** PENDING, PAID, CANCELLED.

**Business purpose:** Represents a request to encash leave. Balance is deducted when the encashment is processed. **PAID** must be set only via the mark-as-paid flow (not via `update()`), so that balance and transaction are updated consistently.

**Domain methods:** `create()`, `update()` (cannot set status to PAID), `archive()`, `restore()`, `validate()`.

---

## Entity Relationships

```text
LeaveYearConfiguration (cutoff dates, year label)
         │
LeaveType ──────────────► LeavePolicy (entitlement, limits, eligibility)
         │                            │
         │                            ▼
         │                  LeaveBalance (employee, leave type, year)
         │                            │
         │                            ├──► LeaveTransaction (every change)
         │                            ├──► LeaveRequest (dates, total_days, status)
         │                            └──► LeaveEncashment (days → cash)
         │
         └──► LeaveCycle (employee, leave type; cycle years, total_carried)
```

- **LeaveYearConfiguration** defines leave year boundaries; used to create balances and to resolve the year for a date.
- **LeavePolicy** is per leave type; one active policy per type is used for a given date (e.g. `getActivePolicy(leave_type_id, context)`).
- **LeaveBalance** is per (employee, leave type, year). All consumption (request approval, encashment) and credits (earn, carry, adjustment) go through balance updates and **LeaveTransaction**.
- **LeaveRequest** references a balance; when approved, that balance’s `used` and `remaining` are updated and a REQUEST transaction is created.
- **LeaveEncashment** references a balance; when marked paid, balance is updated and an ENCASHMENT transaction is created.

---

## Business Processes

### Process Flow Overview

1. **Phase 0 – Initial setup:** Leave year configuration, leave types, policies; then initialize balances (and cycles if needed) for employees.
2. **Phase 1 – Ongoing operations:** Process leave requests (submit, approve/reject/cancel), handle encashments, update balances and create transactions.
3. **Phase 2 – Year-end:** Close current year balances, compute carry-over, create new year balances and CARRY transactions; close/start cycles as needed.

```text
┌─────────────────────────────────────────────────────────────┐
│ Phase 0: Initial Setup                                        │
│ • Leave year configuration, leave types, policies            │
│ • Initialize balances (and cycles) for employees            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Ongoing Operations                                  │
│ • Submit / approve / reject / cancel leave requests          │
│ • Encashment requests and mark-as-paid                       │
│ • Balance and transaction updates                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Year-End                                             │
│ • Close current year balances                                │
│ • Calculate carry-over, create new balances and CARRY txns    │
│ • Close completed cycles; start new cycles if needed         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  (Repeat Phase 1 for next year)
```

---

### Process 1: Leave Request Workflow

**Rule:** Balance is deducted **only when a request is APPROVED**. PENDING requests do not change balance. Cancelling an APPROVED request requires the application to restore balance and record a reversing transaction.

#### Scenario A – Employee submits leave request

1. Resolve leave year for request dates (e.g. `LeaveYearConfiguration.findActiveForDate(start_date)`).
2. Load **LeaveBalance** for (employee_id, leave_type_id, year). Ensure balance exists and is OPEN.
3. Check policy eligibility (e.g. `policy.isEmployeeEligible(...)`).
4. Compute or validate `total_days` (domain ensures `total_days` ≤ calendar days in range; application may apply excluded weekdays/holidays).
5. Ensure no overlapping PENDING/APPROVED requests (`findOverlappingRequests(employee_id, start_date, end_date, exclude_id, context)`).
6. Create **LeaveRequest** with `LeaveRequest.create(...)` (status is always PENDING).
7. Call **`request.assertBalanceSufficient(balance)`** (validates balance match and `balance.remaining >= total_days`).
8. Persist the request. **Do not** update balance yet.

#### Scenario B – Manager approves request

1. Load request; ensure status is PENDING.
2. Load balance by `balance_id`; re-validate `balance.remaining >= request.total_days` (balance may have changed).
3. Update request status to APPROVED (and set approval_date, approval_by, remarks via repository).
4. Update balance: `used += total_days`, `remaining -= total_days`, set `last_transaction_date`.
5. Create **LeaveTransaction**: type REQUEST, `days = -request.total_days`, with remarks.
6. Persist balance and transaction.

#### Scenario C – Manager rejects request

1. Load request; ensure status is PENDING.
2. Update request status to REJECTED; set approval_date, approval_by, remarks.
3. No balance or transaction change.

#### Scenario D – Employee cancels request

- **If PENDING:** Update status to CANCELLED. No balance change.
- **If APPROVED (reversal):** Application must update balance (`used -= total_days`, `remaining += total_days`), create a reversing transaction (e.g. ADJUSTMENT or REQUEST with positive days), then set request status to CANCELLED. Domain does not perform the reversal; the application orchestrates it.

#### Scenario E – Employee updates request

Only **PENDING** requests can be updated (dates, total_days, reason, etc.). After update, re-run validations (balance sufficiency, overlapping requests) and call `request.assertBalanceSufficient(balance)` again before persisting.

**Request lifecycle (simplified):**

```text
    Create
       ↓
   PENDING
       ↓
   ┌────┴────┬──────────┐
   ↓         ↓          ↓
 Approve  Reject    Cancel / Update
   ↓         ↓          ↓
APPROVED  REJECTED   CANCELLED or still PENDING
   ↓         │
 Balance     │
 updated     └── No balance change
   +
 Transaction
```

---

### Process 2: Year-End Processing

1. Identify OPEN balances for the ending leave year.
2. For each balance, compute carry-over (e.g. min(remaining, policy.carry_limit)); excess is forfeited.
3. Close balances (status CLOSED/FINALIZED as per business rules).
4. Create CARRY transactions (positive days) where carry-over > 0.
5. Create new **LeaveYearConfiguration** for the next year if needed.
6. Create new **LeaveBalance** rows for the new year (earned from policy, carried_over from step 2, remaining = beginning_balance + earned + carried_over - used - encashed).
7. Close completed **LeaveCycle** rows; create new cycles where the policy’s `carried_over_years` requires it.

---

### Process 3: Leave Encashment

1. **Request:** Ensure policy allows encashment and `balance.encashed + requested_days <= policy.encash_limit`; ensure `balance.remaining >= requested_days`. Create **LeaveEncashment** with status PENDING.
2. **Process payment:** Use the **mark-as-paid** flow (repository `markAsPaid(id, payroll_ref, context)`). That flow must: update balance (`encashed += total_days`, `remaining -= total_days`), create **LeaveTransaction** (type ENCASHMENT, negative days), set encashment status to PAID. Do **not** set PAID via `LeaveEncashment.update()`.

---

## Business Rules and Invariants

### LeaveBalance

- **Invariant:** `remaining = (beginning_balance + earned + carried_over) - (used + encashed)`. Enforced in `validate()`; create/update throws if violated.
- All of `beginning_balance`, `earned`, `used`, `carried_over`, `encashed`, `remaining` must be ≥ 0.
- When updating after approval or encashment, update both the component fields and `remaining` so the formula still holds.

### LeaveRequest

- New requests are created **only as PENDING** (`create()` does not accept status).
- **Update** is allowed only when status is PENDING. APPROVED, REJECTED, and CANCELLED are terminal for updates.
- **total_days** must be > 0 and ≤ calendar days between start_date and end_date (inclusive). Excluded weekdays/holidays are applied in the application layer.
- Before persisting a new or updated request, call **`request.assertBalanceSufficient(balance)`** (validates balance identity and `balance.remaining >= request.total_days`).

### LeaveEncashment

- **PAID** must not be set via `update()`. Only the mark-as-paid flow may set PAID.
- Once status is PAID, the encashment cannot be updated or archived.

### LeaveTransaction

- **REQUEST**, **ENCASHMENT:** `days` must be negative.
- **CARRY:** `days` must be positive.
- **ADJUSTMENT:** `days` may be positive or negative (non-zero).
- `days` must not be zero.

### Summary

- Balance deduction happens **only on approval** of a leave request.
- Rejection and cancellation of a PENDING request do not change balance.
- Cancelling an APPROVED request requires the application to restore balance and create a reversing transaction.
- Re-validate balance at approval time (it may have changed since submission).
- Overlap check: prevent overlapping PENDING/APPROVED requests for the same employee (use `findOverlappingRequests` on create and when updating dates).

---

## Status Lifecycles

| Entity         | Statuses              | Notes |
|----------------|------------------------|-------|
| LeaveRequest   | PENDING → APPROVED / REJECTED / CANCELLED | Only PENDING can be updated. |
| LeaveBalance   | OPEN, CLOSED, REOPENED, FINALIZED | Closed/finalized at year-end or by process. |
| LeaveEncashment| PENDING → PAID / CANCELLED | PAID only via mark-as-paid flow. |
| LeavePolicy    | DRAFT, ACTIVE, INACTIVE, RETIRED | One ACTIVE per leave type typical. |
| LeaveCycle     | ACTIVE, COMPLETED     | Completed when cycle end year is reached. |

---

## Repository Interfaces

All methods take `context: Context` as the last parameter. Paginated lists use `PaginatedResult<T>` from `@/core/utils/pagination.util`. Full signatures are in `domain/repositories/*.repository.ts`.

| Repository | Key methods |
|------------|-------------|
| **LeaveTypeRepository** (shared-domain, re-exported) | create, update, findById, findPaginatedList, findByName, findByCode, combobox |
| **LeavePolicyRepository** | create, update, findById, findPaginatedList, retrieveActivePolicies, getActivePolicy, activatePolicy, retirePolicy |
| **LeaveRequestRepository** | create, update, findById, findByEmployee, findPending, findPaginatedList, updateStatus, findOverlappingRequests |
| **LeaveBalanceRepository** | create, update, findById, findByEmployeeYear, findByLeaveType, closeBalance, resetBalancesForYear |
| **LeaveCycleRepository** | create, update, findById, findByEmployee, getActiveCycle, findOverlappingCycle, closeCycle |
| **LeaveTransactionRepository** | create, findByBalance, recordTransaction |
| **LeaveYearConfigurationRepository** | create, update, findById, findPaginatedList, findByYear, findActiveForDate, findAll |
| **LeaveEncashmentRepository** | create, update, findById, findPending, markAsPaid, findByEmployee |

**Signature notes (align with code):**

- **findPaginatedList** (all): `(term, page, limit, is_archived, context)`.
- **LeaveRequestRepository.updateStatus**: `(id, status, approver_id, remarks, context)`.
- **LeaveRequestRepository.findOverlappingRequests**: `(employee_id, start_date, end_date, context, exclude_id)` — use `exclude_id` when updating a request so the current request is not counted as overlapping.
- **LeavePolicyRepository.retirePolicy**: `(id, context, expiry_date?)` — optional `expiry_date` for retirement date.
- **LeaveEncashmentRepository.markAsPaid**: `(id, payroll_ref, context)`.
- **LeaveTransactionRepository.recordTransaction**: `(balance_id, type, days, remarks, user_id, context)` where `type` is `'earn' | 'use' | 'carry_over' | 'encash'`. Implementation should map these to domain transaction types (e.g. `'use'` → REQUEST, `'encash'` → ENCASHMENT) and enforce sign rules (negative for use/encash, positive for earn/carry_over).

---

## Constants and Enums

- **LEAVE_MANAGEMENT_TOKENS:** DI tokens for each repository (`domain/constants/tokens.constant.ts`). LeaveType repository is in shared-domain (no token here).
- **LEAVE_MANAGEMENT_DATABASE_MODELS:** Table/entity names for logging and infrastructure (`domain/constants/database.constants.ts`). `leave_types` is in shared-domain (not listed here).

**Enums** (`domain/enum/`):

- **EnumLeaveRequestStatus:** PENDING, APPROVED, REJECTED, CANCELLED
- **EnumLeavePolicyStatus:** DRAFT, ACTIVE, INACTIVE, RETIRED
- **EnumLeaveBalanceStatus:** OPEN, CLOSED, REOPENED, FINALIZED
- **EnumLeaveCycleStatus:** ACTIVE, COMPLETED
- **EnumLeaveTransactionType:** REQUEST, ENCASHMENT, ADJUSTMENT, CARRY
- **EnumLeaveEncashmentStatus:** PENDING, PAID, CANCELLED

---

## Usage Summary

1. **Create leave request:** `LeaveRequest.create(...)` (no status). Load balance, call `request.assertBalanceSufficient(balance)`, then persist.
2. **Approve request:** Update balance (`used += total_days`, `remaining -= total_days`), create **LeaveTransaction** (type REQUEST, negative days), update request status to APPROVED.
3. **Encashment:** Create **LeaveEncashment** (PENDING). To pay, use the mark-as-paid flow (update balance, create ENCASHMENT transaction, set encashment to PAID)—do not use `LeaveEncashment.update()` to set PAID.
4. **Balance updates:** Always keep `remaining = (beginning_balance + earned + carried_over) - (used + encashed)`; otherwise `LeaveBalance.validate()` throws.

All rules above are enforced in the domain; the application layer orchestrates repositories and calls domain methods in the correct order.
