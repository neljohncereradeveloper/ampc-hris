# Leave Balance Use Cases

Documentation for all leave-balance application use cases: create, get by id / by employee-year / by leave type, close (single and for employee), generate balances for all employees at year start, and reset for year.

---

## Table of Contents

1. [Overview](#overview)
2. [Balance Lifecycle](#balance-lifecycle)
3. [Domain & Supporting Pieces](#domain--supporting-pieces)
4. [Use Cases](#use-cases)
5. [Commands & Types](#commands--types)
6. [Dependencies](#dependencies)

---

## Overview

Leave balances track an employee’s leave credits per **leave type** and **leave year** (e.g. beginning balance, earned, used, carried over, encashed, remaining). They are created for a given year and policy, then updated by leave requests and encashments. Closing a balance locks it (e.g. at year-end or on resignation).

| Use Case | Purpose |
|----------|--------|
| **CreateLeaveBalanceUseCase** | Create a single leave balance (employee, leave type, policy, year, amounts, status). |
| **GetLeaveBalanceByIdUseCase** | Get one balance by id. |
| **GetLeaveBalanceByEmployeeYearUseCase** | Get all balances for an employee for a given year. |
| **GetLeaveBalanceByLeaveTypeUseCase** | Get the balance for (employee, leave type, year); used when resolving balance for a leave request. |
| **CloseBalanceUseCase** | Close a single balance by id (year-end or resignation). |
| **CloseBalancesForEmployeeUseCase** | Close all open/reopened balances for one employee in a year (e.g. on resignation). |
| **GenerateBalancesForAllEmployeesUseCase** | Generate leave balances for the start of a year for all employees eligible for leave (with policy eligibility and skipped-employees report). |
| **ResetBalancesForYearUseCase** | Bulk year-end: close all OPEN balances for that year (status → CLOSED). Amounts are **not** zeroed; only the year is finalized. |

---

## Balance Lifecycle

```
Create (or Generate for year)
        ↓
     OPEN / REOPENED  ←── used by leave requests, encashment
        ↓
  Close (single or for employee)  or  Reset for year
        ↓
   CLOSED / FINALIZED
```

- **Close (single):** One balance by id. Use at year-end in a loop or when closing a specific balance.
- **Close for employee:** All open/reopened balances for one employee in a year (e.g. resignation before year-end).
- **Reset for year:** Bulk operation that **closes** all OPEN (and REOPENED) balances for that year—status becomes CLOSED/FINALIZED. Balance amounts (remaining, used, earned, etc.) are **unchanged**; only the status is updated so the year is locked. Do not confuse with zeroing balances.

---

## Domain & Supporting Pieces

### LeaveBalance (domain model)

Validations in `LeaveBalance.create()` and `validate()` include: required positive `employee_id`, `leave_type_id`, `policy_id`; non-empty `year`; non-negative numeric fields (`beginning_balance`, `earned`, `used`, `carried_over`, `encashed`, `remaining`); valid `status`.

### LeaveBalanceBulkCreateService (application service)

Used by **GenerateBalancesForAllEmployeesUseCase**. Creates leave balances from a list of entries (create-or-skip per employee+leave_type+year), writes one activity log, and returns `created_count` / `skipped_count`. Does not start a transaction; receives context from the caller. All numeric values are coerced to numbers for correct calculations.

### ActiveEmployeeIdsPort (domain port)

- **getEmployeesEligibleForLeave(context, filters)** → `Promise<EmployeeEligibilityInfo[]>`  
- **Filters:** `ActiveEmployeeIdsFilters`: `employment_types?: string[]`, `employment_statuses?: string[]` (e.g. `["regular","probationary"]`, `["active","on-leave"]`).  
- **EmployeeEligibilityInfo:** `id`, `first_name`, `last_name`, `employment_type`, `employment_status`, `hire_date` (for policy eligibility and reporting).  
- Implemented by **ActiveEmployeeIdsAdapter** using shared-domain `EmployeeRepository.findEmployeesEligibleForLeave`.

### Policy eligibility (generate use case)

When generating annual balances, an employee gets a balance for a policy only if:

- **allowed_employment_types:** If non-empty, employee’s employment type must be in the list (case-insensitive).
- **allowed_employee_statuses:** If non-empty, employee’s employment status must be in the list (case-insensitive).
- **minimum_service_months:** If &gt; 0, completed months from hire date to start of the given year must be ≥ this value.

Tenure is computed as completed full months (UTC) between hire date and year start. Invalid or missing hire date is treated as ineligible.

---

## Use Cases

### 1. CreateLeaveBalanceUseCase

**Purpose:** Create a single leave balance for an employee and policy for a year. Amounts are derived from the policy: earned = policy annual_entitlement, beginning_balance/used/carried_over/encashed = 0, remaining = earned, status = OPEN.

**Input:** `CreateLeaveBalanceCommand` (employee_id, policy_id, year, remarks?), optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. Load and validate policy, leave type, and employee exist and are not archived.
3. Build entity: `LeaveBalance.create({ employee_id, leave_type_id, policy_id, year, beginning_balance: 0, earned: policy.annual_entitlement, used: 0, carried_over: 0, encashed: 0, remaining: earned, status: OPEN, remarks, created_by })`. Domain validates.
4. Persist: `LeaveBalanceRepository.create(entity, manager)`. If create fails → throw (500).
5. Activity log: CREATE with id, employee_id, leave_type_id, year, created_by, created_at.
6. Return created balance.

**Errors:** 400 (domain validation), 500 (create failed).

---

### 2. GetLeaveBalanceByIdUseCase

**Purpose:** Get a leave balance by id.

**Input:** `id: number`.

**Process:** Run in transaction; call `LeaveBalanceRepository.findById(id, manager)`; return balance or `null`.

**Returns:** `LeaveBalance | null`.

---

### 3. GetLeaveBalanceByEmployeeYearUseCase

**Purpose:** Get all leave balances for an employee for a given year.

**Input:** `employee_id: number`, `year: string`.

**Process:** Run in transaction; call `LeaveBalanceRepository.findByEmployeeYear(employee_id, year, manager)`.

**Returns:** `LeaveBalance[]`.

---

### 4. GetLeaveBalanceByLeaveTypeUseCase

**Purpose:** Resolve the single balance for (employee, leave type, year). Used when creating/updating leave requests to attach the correct balance.

**Input:** `employee_id: number`, `leave_type_id: number`, `year: string`.

**Process:** Run in transaction; call `LeaveBalanceRepository.findByLeaveType(employee_id, leave_type_id, year, manager)`.

**Returns:** `LeaveBalance | null`.

---

### 5. CloseBalanceUseCase

**Purpose:** Close a single leave balance by id. Use at year-end (in batch) or when an employee resigns to close a specific balance early.

**Input:** `id: number`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. Load balance: `findById(id, manager)`. If not found → throw (404).
3. Call `LeaveBalanceRepository.closeBalance(id, manager)`. If fail → throw (500).
4. Activity log: CLOSE with id, employee_id, leave_type_id, year, closed_by, closed_at.
5. Return `true`.

**Errors:** 404 (balance not found), 500 (close failed).

---

### 6. CloseBalancesForEmployeeUseCase

**Purpose:** Close all open or reopened leave balances for one employee for a given year (e.g. on resignation before year-end).

**Input:** `employee_id: number`, `year: string`, optional `RequestInfo`.

**Process:**

1. Validate year non-empty → else throw (400).
2. Run in transaction.
3. Load balances: `findByEmployeeYear(employee_id, year, manager)`.
4. Filter to status OPEN or REOPENED; for each, call `closeBalance(balance.id, manager)`.
5. Activity log: CLOSE_BALANCES_FOR_EMPLOYEE with employee_id, year, closed_count, closed_by, closed_at.
6. Return `{ closed_count: number }`.

**Errors:** 400 (year empty).

---

### 7. GenerateBalancesForAllEmployeesUseCase

**Purpose:** Generate leave balances for the start of a year for all employees eligible for leave. Applies per-policy rules (allowed_employment_types, allowed_employee_statuses, minimum_service_months) and returns created/skipped counts plus a list of skipped employees with ineligibility details.

**Input:** `year: string`, `filters: ActiveEmployeeIdsFilters`, optional `RequestInfo`.  
**Filters:** `employment_types: string[]`, `employment_statuses: string[]` (both required and non-empty).

**Process:**

1. Validate year and filters (employment_types and employment_statuses non-empty) → else throw (400).
2. Run in transaction.
3. Get employees: `ActiveEmployeeIdsPort.getEmployeesEligibleForLeave(manager, filters)`.
4. Get active policies: `LeavePolicyRepository.retrieveActivePolicies(manager)`.
5. Parse year start (UTC 1 Jan) for tenure; for each (employee, policy):
   - Check eligibility: employment type, employment status, minimum_service_months (completed months from hire to year start). If ineligible → append to `skipped_employees` with employee_id, employee_name, leave_type, reason `'ineligible'`, details (specific reason).
   - If eligible → add entry to list (employee_id, leave_type_id, policy_id, earned/remaining from policy.annual_entitlement).
6. Call `LeaveBalanceBulkCreateService.execute(year, entries, manager, requestInfo)` (create-or-skip per employee+leave_type+year).
7. Return `{ created_count, skipped_count, skipped_employees }`.

**Returns:** `GenerateBalancesForAllEmployeesResult`:

- `created_count: number` – balances created.
- `skipped_count: number` – balances skipped (already existed).
- `skipped_employees: SkippedEmployeeItem[]` – each: `employee_id`, `employee_name`, `leave_type`, `reason: 'ineligible'`, `details` (e.g. tenure below minimum, employment type/status not in policy).

**Errors:** 400 (year invalid, filters missing/empty).

---

### 8. ResetBalancesForYearUseCase

**Purpose:** Bulk year-end operation for a given year. Closes all OPEN (and REOPENED) balances for that year so the year is finalized. Exact behavior is defined by the repository implementation (e.g. set status to CLOSED for all OPEN balances for that year).

**What it does:** Updates balance **status** to CLOSED/FINALIZED for the given year. The year is then locked (no further leave requests or encashments against those balances).

**What it does not do:** Does **not** zero or change any numeric amounts (remaining, used, earned, carried_over, encashed, etc.). Those values remain as-is for audit and reporting.

**Input:** `year: string`, optional `RequestInfo`.

**Process:**

1. Validate year non-empty → else throw (400).
2. Run in transaction.
3. Call `LeaveBalanceRepository.resetBalancesForYear(year, manager)`. If fail → throw (500).
4. Activity log: RESET_FOR_YEAR with year, reset_by, reset_at.
5. Return `true`.

**Errors:** 400 (year empty), 500 (reset failed).

---

## Commands & Types

| Command / Type | Description |
|----------------|-------------|
| **CreateLeaveBalanceCommand** | `employee_id`, `policy_id`, `year`, `remarks?` (amounts and status are set by the use case from the policy). |
| **GenerateBalancesForYearEntry** | `employee_id`, `leave_type_id`, `policy_id`, optional numeric fields and `remarks?` (used by bulk-create service). |
| **ActiveEmployeeIdsFilters** | `employment_types?: string[]`, `employment_statuses?: string[]`. |
| **EmployeeEligibilityInfo** | `id`, `first_name`, `last_name`, `employment_type`, `employment_status`, `hire_date`. |
| **SkippedEmployeeItem** | `employee_id`, `employee_name`, `leave_type`, `reason`, `details`. |
| **GenerateBalancesForAllEmployeesResult** | `created_count`, `skipped_count`, `skipped_employees`. |

---

## Dependencies

| Dependency | Token / Source | Used by |
|------------|----------------|--------|
| **LeaveBalanceRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE` | All use cases that read/write balances |
| **LeavePolicyRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY` | GenerateBalancesForAllEmployeesUseCase |
| **ActiveEmployeeIdsPort** | `LEAVE_MANAGEMENT_TOKENS.ACTIVE_EMPLOYEE_IDS_PORT` | GenerateBalancesForAllEmployeesUseCase |
| **LeaveBalanceBulkCreateService** | (by type) | GenerateBalancesForAllEmployeesUseCase |
| **TransactionPort** | `TOKENS_CORE.TRANSACTIONPORT` | All use cases that run in a transaction |
| **ActivityLogRepository** | `TOKENS_CORE.ACTIVITYLOGS` | Create, Close, CloseBalancesForEmployee, Reset, and bulk-create service |

Activity log **actions** are in `domain/constants/leave-balance.constants.ts` (`LEAVE_BALANCE_ACTIONS`). Entity name for logs is `LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES` (`'leave_balances'`).
