import { LeavePolicy } from '../../models/leave-policy.model';
import { EnumLeavePolicyStatus } from '../../enum/leave-policy-status.enum';

/**
 * Result of policy activation validation.
 */
export interface PolicyActivationValidationResult {
  canActivate: boolean;
  reason?: string;
  shouldRetireExisting?: boolean;
  existingPolicyId?: number;
}

/**
 * Domain service for policy activation business rules.
 *
 * Encapsulates:
 * - Validating policy activation readiness
 * - "Only one active policy per leave type" rule
 * - Policy date validation
 * - Whether a policy can be updated or retired
 */
export class PolicyActivationService {
  /**
   * Validates if a policy can be activated.
   *
   * Rules:
   * - Only ONE policy per leave type can be ACTIVE at a time.
   * - When activating a new policy, the existing active one should be retired.
   * - Expiry date must be after effective date (if both provided).
   * - Policy must be in DRAFT, INACTIVE, or RETIRED status to activate.
   */
  canActivatePolicy(
    new_policy: LeavePolicy,
    existing_active_policy: LeavePolicy | null,
  ): PolicyActivationValidationResult {
    if (new_policy.status === EnumLeavePolicyStatus.ACTIVE) {
      return {
        canActivate: false,
        reason:
          'Policy is already ACTIVE. Cannot activate an already active policy.',
      };
    }

    if (new_policy.effective_date && new_policy.expiry_date) {
      if (new_policy.expiry_date <= new_policy.effective_date) {
        return {
          canActivate: false,
          reason: 'Expiry date must be after effective date.',
        };
      }
    }

    if (existing_active_policy && existing_active_policy.id !== new_policy.id) {
      return {
        canActivate: true,
        shouldRetireExisting: true,
        existingPolicyId: existing_active_policy.id,
        reason: `Another policy (ID: ${existing_active_policy.id}) is currently ACTIVE for this leave type. Activating this policy will automatically retire the existing one.`,
      };
    }

    return { canActivate: true, shouldRetireExisting: false };
  }

  /**
   * Validates policy parameters (entitlements, limits, cycle length).
   */
  validatePolicyParameters(policy: LeavePolicy): {
    isValid: boolean;
    reason?: string;
  } {
    if (policy.annual_entitlement < 0) {
      return {
        isValid: false,
        reason: 'Annual entitlement cannot be negative.',
      };
    }
    if (policy.carry_limit < 0) {
      return { isValid: false, reason: 'Carry limit cannot be negative.' };
    }
    if (policy.encash_limit < 0) {
      return { isValid: false, reason: 'Encash limit cannot be negative.' };
    }
    if (policy.carried_over_years < 1) {
      return {
        isValid: false,
        reason: 'Cycle length must be at least 1 year.',
      };
    }
    if (
      policy.minimum_service_months != null &&
      policy.minimum_service_months < 0
    ) {
      return {
        isValid: false,
        reason: 'Minimum service months cannot be negative.',
      };
    }
    return { isValid: true };
  }

  /**
   * Only DRAFT or INACTIVE policies can be updated.
   * ACTIVE and RETIRED cannot be modified.
   */
  canUpdatePolicy(policy: LeavePolicy): {
    canUpdate: boolean;
    reason?: string;
  } {
    if (policy.status === EnumLeavePolicyStatus.ACTIVE) {
      return {
        canUpdate: false,
        reason:
          'ACTIVE policies cannot be modified. Create a new policy instead.',
      };
    }
    if (policy.status === EnumLeavePolicyStatus.RETIRED) {
      return {
        canUpdate: false,
        reason:
          'RETIRED policies cannot be modified. Create a new policy instead.',
      };
    }
    return { canUpdate: true };
  }

  /**
   * Only non-RETIRED policies can be retired.
   */
  canRetirePolicy(policy: LeavePolicy): {
    canRetire: boolean;
    reason?: string;
  } {
    if (policy.status === EnumLeavePolicyStatus.RETIRED) {
      return { canRetire: false, reason: 'Policy is already RETIRED.' };
    }
    return { canRetire: true };
  }
}
