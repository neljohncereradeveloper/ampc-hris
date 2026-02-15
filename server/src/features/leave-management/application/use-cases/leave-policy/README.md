# Leave Policy Use Cases

Documentation for all leave-policy application use cases: create, update, archive, restore, paginated list, get active, activate, and retire.

---

## Table of Contents

1. [Overview](#overview)
2. [Status Lifecycle](#status-lifecycle)
3. [Domain Validation (PolicyActivationService)](#domain-validation-policyactivationservice)
4. [Use Cases](#use-cases)
5. [Commands](#commands)
6. [Dependencies](#dependencies)

---

## Overview

Leave policies define entitlements and rules per **leave type** (e.g. annual entitlement, carry limit, encash limit, eligibility). Only **one policy per leave type** can be **ACTIVE** at a time. Use cases enforce this and other business rules via the domain service `PolicyActivationService`.

| Use Case | Purpose |
|----------|--------|
| **CreateLeavePolicyUseCase** | Create a new policy (always as DRAFT). |
| **UpdateLeavePolicyUseCase** | Update policy fields (only DRAFT or INACTIVE). |
| **ArchiveLeavePolicyUseCase** | Soft-delete a policy. |
| **RestoreLeavePolicyUseCase** | Restore an archived policy. |
| **GetPaginatedLeavePolicyUseCase** | List policies with pagination and optional archive filter. |
| **GetActivePolicyUseCase** | Get the current ACTIVE policy for a leave type. |
| **RetrieveActivePoliciesUseCase** | Get all currently ACTIVE policies (e.g. for dropdown when creating a leave balance). |
| **ActivatePolicyUseCase** | Set policy to ACTIVE; retires existing ACTIVE policy for same leave type if any. |
| **RetirePolicyUseCase** | Set policy to RETIRED (optional expiry date). |

---

## Status Lifecycle

```
                    Create
                       ↓
                    DRAFT
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓               ↓
    Activate      Update            Archive
        ↓              ↓               ↓
     ACTIVE      (still DRAFT)    (soft-deleted)
        ↓              ↓
    Retire        Activate
        ↓              ↓
    RETIRED       ACTIVE
        │              │
        └────── or ────┘
                 ↓
            (Update → INACTIVE possible)
```

**Rules:**

- **DRAFT** – New policies start here. Can be updated or activated.
- **ACTIVE** – Only one per leave type. Cannot be updated; use Retire then create/activate a new one.
- **INACTIVE** – Can be updated or activated again.
- **RETIRED** – Terminal. Cannot be updated or retired again.

---

## Domain Validation (PolicyActivationService)

Located in `domain/services/policy/policy-activation.service.ts`. Used by create, update, activate, and retire use cases.

| Method | Purpose |
|--------|--------|
| **validatePolicyParameters(policy)** | Ensures `annual_entitlement`, `carry_limit`, `encash_limit` ≥ 0; `carried_over_years` ≥ 1; `minimum_service_months` ≥ 0 when set. |
| **canUpdatePolicy(policy)** | Only DRAFT or INACTIVE can be updated. ACTIVE and RETIRED cannot. |
| **canActivatePolicy(newPolicy, existingActivePolicy)** | Checks policy is not already ACTIVE; expiry > effective when both set; if another ACTIVE exists for same leave type, returns `shouldRetireExisting` and `existingPolicyId`. |
| **canRetirePolicy(policy)** | Only non-RETIRED policies can be retired. |

---

## Use Cases

### 1. CreateLeavePolicyUseCase

**Purpose:** Create a new leave policy. Status is always set to **DRAFT** (command `status` is ignored).

**Input:** `CreateLeavePolicyCommand`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Validate leave type:** Load by `leave_type_id` via shared-domain `LeaveTypeRepository`. If not found or archived → throw `LeavePolicyBusinessException` (404).
3. **Build policy:** `LeavePolicy.create({ ...command, status: DRAFT, created_by })`.
4. **Parameter validation:** `PolicyActivationService.validatePolicyParameters(policy)`. If invalid → throw (400).
5. **Persist:** `LeavePolicyRepository.create(policy, manager)`.
6. **Activity log:** Log CREATE with id, leave_type_id, created_by, created_at.
7. Return created policy.

**Errors:**

- 404 – Leave type not found or archived.
- 400 – Invalid policy parameters (negative entitlement/limits, cycle length &lt; 1, etc.).
- 500 – Create failed.

---

### 2. UpdateLeavePolicyUseCase

**Purpose:** Update policy fields. **Status is not updated** here (use Activate or Retire). Only DRAFT or INACTIVE policies can be updated.

**Input:** `id`, `UpdateLeavePolicyCommand`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load policy:** `LeavePolicyRepository.findById(id)`. If not found → throw (404).
3. **Update guard:** `PolicyActivationService.canUpdatePolicy(policy)`. If ACTIVE or RETIRED → throw (400).
4. Capture before state for change tracking.
5. **Update:** `policy.update({ ...command fields, updated_by })` (no `status`). Set `policy.updated_at`.
6. **Parameter validation:** `PolicyActivationService.validatePolicyParameters(policy)`. If invalid → throw (400).
7. **Persist:** `LeavePolicyRepository.update(id, policy, manager)`.
8. **Activity log:** Log UPDATE with id, changed_fields, updated_by, updated_at.
9. Return updated policy.

**Errors:**

- 404 – Policy not found.
- 400 – Policy cannot be updated (ACTIVE/RETIRED) or invalid parameters.
- 500 – Update failed.

---

### 3. ArchiveLeavePolicyUseCase

**Purpose:** Soft-delete a policy (set `deleted_at`, `deleted_by`).

**Input:** `id`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. Load policy; if not found → throw (404).
3. **Archive:** `policy.archive(requestInfo?.user_name)`. Throws if already archived.
4. **Persist:** `LeavePolicyRepository.update(id, policy, manager)`.
5. **Activity log:** Log ARCHIVE with id, leave_type_id, archived_by, archived_at.
6. Return `true`.

**Errors:**

- 404 – Policy not found.
- 409 – Already archived (from domain).
- 500 – Update failed.

---

### 4. RestoreLeavePolicyUseCase

**Purpose:** Restore an archived policy (clear `deleted_at`, `deleted_by`).

**Input:** `id`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. Load policy; if not found → throw (404).
3. **Restore:** `policy.restore()`. Throws if not archived.
4. **Persist:** `LeavePolicyRepository.update(id, policy, manager)`.
5. **Activity log:** Log RESTORE with id, leave_type_id, restored_by, restored_at.
6. Return `true`.

**Errors:**

- 404 – Policy not found.
- 409 – Not archived (from domain).
- 500 – Update failed.

---

### 5. GetPaginatedLeavePolicyUseCase

**Purpose:** List leave policies with pagination and optional archive filter.

**Input:** `term`, `page`, `limit`, `is_archived`.

**Process:**

1. Run in transaction.
2. Call `LeavePolicyRepository.findPaginatedList(term, page, limit, is_archived, manager)`.
3. Return `PaginatedResult<LeavePolicy>`.

**Errors:** None (returns empty list if no matches).

---

### 6. GetActivePolicyUseCase

**Purpose:** Get the current ACTIVE policy for a given leave type (if any).

**Input:** `leave_type_id`.

**Process:**

1. Run in transaction.
2. Call `LeavePolicyRepository.getActivePolicy(leave_type_id, manager)`.
3. Return `LeavePolicy | null`.

**Errors:** None.

---

### 7. RetrieveActivePoliciesUseCase

**Purpose:** Return all currently ACTIVE leave policies. Use when the client needs to list policies (e.g. dropdown for policy_id when creating a leave balance).

**Input:** None.

**Process:**

1. Run in transaction.
2. Call `LeavePolicyRepository.retrieveActivePolicies(manager)`.
3. Return `LeavePolicy[]`.

**Errors:** None (returns empty array if no active policies).

---

### 8. ActivatePolicyUseCase

**Purpose:** Set a policy to ACTIVE. Enforces “one active policy per leave type”: if another ACTIVE policy exists for the same leave type, it is retired first (expiry = day before new policy’s effective date, or today if no effective date).

**Input:** `id`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load policy:** `LeavePolicyRepository.findById(id)`. If not found → throw (404).
3. **Load existing active:** `LeavePolicyRepository.getActivePolicy(policy.leave_type_id, manager)`.
4. **Activation validation:** `PolicyActivationService.canActivatePolicy(policy, existing_active_policy)`. If `!canActivate` → throw (400).
5. **Retire existing (if any):** If `shouldRetireExisting` and `existingPolicyId`:
   - Compute `old_policy_expiry_date`: day before `policy.effective_date`, or today if no effective date.
   - Call `LeavePolicyRepository.retirePolicy(existingPolicyId, manager, old_policy_expiry_date)`. If fail → throw (500).
6. **Activate:** `LeavePolicyRepository.activatePolicy(id, manager)`. If fail → throw (500).
7. **Activity log:** Log ACTIVATE with id, leave_type_id, status, activated_by, activated_at.
8. Return `true`.

**Errors:**

- 404 – Policy not found.
- 400 – Cannot activate (e.g. already ACTIVE, or expiry ≤ effective when both set).
- 500 – Failed to retire existing or to activate.

---

### 9. RetirePolicyUseCase

**Purpose:** Set a policy to RETIRED. Optional `expiry_date` can be passed for the retirement date.

**Input:** `id`, optional `expiry_date`, optional `RequestInfo`.

**Process:**

1. Run in transaction.
2. **Load policy:** `LeavePolicyRepository.findById(id)`. If not found → throw (404).
3. **Retire guard:** `PolicyActivationService.canRetirePolicy(policy)`. If already RETIRED → throw (400).
4. **Retire:** `LeavePolicyRepository.retirePolicy(id, manager, expiry_date)`. If fail → throw (500).
5. **Activity log:** Log RETIRE with id, leave_type_id, status, retired_by, retired_at.
6. Return `true`.

**Errors:**

- 404 – Policy not found.
- 400 – Policy already RETIRED.
- 500 – Retirement failed.

---

## Commands

| Command | Main fields |
|---------|-------------|
| **CreateLeavePolicyCommand** | `leave_type_id`, `annual_entitlement`, `carry_limit`, `encash_limit`, `carried_over_years`, `effective_date?`, `expiry_date?`, `remarks?`, `minimum_service_months?`, `allowed_employment_types?`, `allowed_employee_statuses?`, `excluded_weekdays?`. (Status is forced to DRAFT.) |
| **UpdateLeavePolicyCommand** | Same as above (all optional). Status is **not** applied in update. |

---

## Dependencies

| Dependency | Token / source | Used by |
|------------|----------------|--------|
| **TransactionPort** | `TOKENS_CORE.TRANSACTIONPORT` | All use cases |
| **LeavePolicyRepository** | `LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY` | All except create (create also uses it) |
| **LeaveTypeRepository** | `SHARED_DOMAIN_TOKENS.LEAVE_TYPE` | CreateLeavePolicyUseCase only |
| **ActivityLogRepository** | `TOKENS_CORE.ACTIVITYLOGS` | Create, Update, Archive, Restore, Activate, Retire |
| **PolicyActivationService** | Domain service (new instance in each use case) | Create, Update, Activate, Retire |

Activity log **action** names come from `domain/constants/leave-policy.constants.ts` (`LEAVE_POLICY_ACTIONS`). Entity name for logs is `LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES` (`'leave_policies'`).
