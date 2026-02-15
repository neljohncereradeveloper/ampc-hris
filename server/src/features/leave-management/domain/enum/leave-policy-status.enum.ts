/**
 * Status of a leave policy (rules and entitlement for a leave type).
 * Only one ACTIVE policy per leave type is typically used; others are draft, inactive, or retired.
 */
export enum EnumLeavePolicyStatus {
  /** Policy is being configured; not yet used for balance or request rules. */
  DRAFT = 'draft',
  /** Policy is in effect; used for new balances and leave request validation. */
  ACTIVE = 'active',
  /** Policy is temporarily inactive; not used for new requests. */
  INACTIVE = 'inactive',
  /** Policy is retired (e.g. superseded or no longer offered). */
  RETIRED = 'retired',
}
