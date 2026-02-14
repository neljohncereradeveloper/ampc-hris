# Leave Year Configuration Use Cases

Documentation for all leave-year-configuration application use cases: create, update, archive, restore, paginated list, and find active for date.

---

## Table of Contents

1. [Overview](#overview)
2. [Domain Validation (LeaveYearConfiguration)](#domain-validation-leaveyearconfiguration)
3. [Use Cases](#use-cases)
4. [Commands](#commands)
5. [Dependencies](#dependencies)

---

## Overview

Leave year configurations define the **cutoff period** and **year label** for a leave year (e.g. Nov 26 – Nov 25, year `"2023-2024"`). They are used to resolve which leave year a given date belongs to (`findActiveForDate`) and to scope balances and requests. Leave years do not have to follow the calendar year.

| Use Case | Purpose |
|----------|--------|
| **CreateLeaveYearConfigurationUseCase** | Create a new leave year configuration. |
| **UpdateLeaveYearConfigurationUseCase** | Update cutoff dates, year label, or remarks (not allowed when archived). |
| **ArchiveLeaveYearConfigurationUseCase** | Soft-delete a configuration. |
| **RestoreLeaveYearConfigurationUseCase** | Restore an archived configuration. |
| **GetPaginatedLeaveYearConfigurationUseCase** | List configurations with pagination and optional archive filter. |
| **FindActiveLeaveYearForDateUseCase** | Resolve the active (non-archived) configuration whose cutoff period contains the given date. |

---

## Domain Validation (LeaveYearConfiguration)

The domain model `LeaveYearConfiguration` validates on **create** and **update** (in `validate()`):

- **cutoff_start_date** – Required, must be a valid Date.
- **cutoff_end_date** – Required, must be a valid Date, and **must be after** cutoff_start_date.
- **year** – Required, non-empty, max 20 characters.
- **remarks** – If provided: non-empty and max 500 characters.

**Archive / restore rules (domain):**

- **archive(deleted_by)** – Throws if already archived. Sets `deleted_at`, `deleted_by`.
- **restore()** – Throws if not archived. Clears `deleted_at`, `deleted_by`.
- **update()** – Throws if archived (“Leave year configuration is archived and cannot be updated”).

---

## Use Cases

### 1. CreateLeaveYearConfigurationUseCase

**Purpose:** Create a new leave year configuration (cutoff period + year label).

**Input:** `CreateLeaveYearConfigurationCommand`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Build entity:** `LeaveYearConfiguration.create({ cutoff_start_date, cutoff_end_date, year, remarks, created_by })`. Domain `create()` calls `validate()` (dates required, end > start, year required and length, remarks rules).
3. **Persist:** `LeaveYearConfigurationRepository.create(entity, manager)`. If create returns falsy → throw (500).
4. **Activity log:** Log CREATE with id, year, created_by, created_at.
5. Return created entity.

**Errors:**

- 400 – Domain validation (invalid dates, end ≤ start, year empty/length, remarks).
- 500 – Creation failed.

---

### 2. UpdateLeaveYearConfigurationUseCase

**Purpose:** Update cutoff dates, year, or remarks. Cannot update when archived.

**Input:** `id`, `UpdateLeaveYearConfigurationCommand`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load entity:** `LeaveYearConfigurationRepository.findById(id)`. If not found → throw (404).
3. Capture before state for change tracking (year, updated_at, updated_by).
4. **Update:** `entity.update({ cutoff_start_date, cutoff_end_date, year, remarks, updated_by })`. Domain throws if archived; then calls `validate()`.
5. Set `entity.updated_at` to current time.
6. **Persist:** `LeaveYearConfigurationRepository.update(id, entity, manager)`. If fail → throw (500).
7. Load updated entity; compute changed_fields; **activity log** UPDATE with id, changed_fields, updated_by, updated_at.
8. Return updated entity.

**Errors:**

- 404 – Configuration not found.
- 409 – Entity is archived (from domain).
- 400 – Domain validation (invalid dates or year/remarks).
- 500 – Update failed.

---

### 3. ArchiveLeaveYearConfigurationUseCase

**Purpose:** Soft-delete a leave year configuration.

**Input:** `id`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load entity:** `findById(id)`. If not found → throw (404).
3. **Archive:** `entity.archive(requestInfo?.user_name)`. Domain throws if already archived.
4. **Persist:** `repo.update(id, entity, manager)`. If fail → throw (500).
5. **Activity log:** Log ARCHIVE with id, year, archived_by, archived_at.
6. Return `true`.

**Errors:**

- 404 – Configuration not found.
- 409 – Already archived (from domain).
- 500 – Update failed.

---

### 4. RestoreLeaveYearConfigurationUseCase

**Purpose:** Restore an archived leave year configuration.

**Input:** `id`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load entity:** `findById(id)`. If not found → throw (404).
3. **Restore:** `entity.restore()`. Domain throws if not archived.
4. **Persist:** `repo.update(id, entity, manager)`. If fail → throw (500).
5. **Activity log:** Log RESTORE with id, year, restored_by, restored_at.
6. Return `true`.

**Errors:**

- 404 – Configuration not found.
- 409 – Not archived (from domain).
- 500 – Update failed.

---

### 5. GetPaginatedLeaveYearConfigurationUseCase

**Purpose:** List leave year configurations with pagination and optional archive filter.

**Input:** `term`, `page`, `limit`, `is_archived`.

**Process:**

1. Run in transaction.
2. Call `LeaveYearConfigurationRepository.findPaginatedList(term, page, limit, is_archived, manager)`.
3. Return `PaginatedResult<LeaveYearConfiguration>`.

**Errors:** None (returns empty list if no matches).

---

### 6. FindActiveLeaveYearForDateUseCase

**Purpose:** Resolve which leave year (configuration) a given date falls into. Used when creating balances, resolving balance for a leave request, or any logic that needs “current leave year for date X”. Returns the **active** (non-archived) configuration whose cutoff period contains the date.

**Input:** `date` (Date).

**Process:**

1. Run in transaction.
2. Call `LeaveYearConfigurationRepository.findActiveForDate(date, manager)`.
3. Return `LeaveYearConfiguration | null`.

**Errors:** None. Returns `null` if no active configuration contains the date (e.g. gap between years or no data).

---

## Commands

| Command | Fields |
|---------|--------|
| **CreateLeaveYearConfigurationCommand** | `cutoff_start_date`, `cutoff_end_date`, `year`, `remarks?` |
| **UpdateLeaveYearConfigurationCommand** | `cutoff_start_date?`, `cutoff_end_date?`, `year?`, `remarks?` (all optional) |

---

## Dependencies

| Dependency | Token / source | Used by |
|------------|----------------|--------|
| **TransactionPort** | `TOKENS_CORE.TRANSACTIONPORT` | All use cases |
| **LeaveYearConfigurationRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION` | All use cases |
| **ActivityLogRepository** | `TOKENS_CORE.ACTIVITYLOGS` | Create, Update, Archive, Restore |

Activity log **action** names come from `domain/constants/leave-year-configuration.constants.ts` (`LEAVE_YEAR_CONFIGURATION_ACTIONS`). Entity name for logs is `LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS` (`'leave_year_configurations'`).

**Repository methods used:**

- `create`, `update`, `findById`, `findPaginatedList`, `findActiveForDate` (see `domain/repositories/leave-year-configuration.repository.ts` for full interface including `findByYear`, `findAll`).
