/**
 * Database table/entity names for leave-management feature.
 * Used by infrastructure entities and activity logging.
 */
export const LEAVE_MANAGEMENT_DATABASE_MODELS = {
  LEAVE_POLICIES: 'leave_policies',
  LEAVE_REQUESTS: 'leave_requests',
  LEAVE_BALANCES: 'leave_balances',
  LEAVE_CYCLES: 'leave_cycles',
  LEAVE_TRANSACTIONS: 'leave_transactions',
  LEAVE_YEAR_CONFIGURATIONS: 'leave_year_configurations',
  LEAVE_ENCASHMENTS: 'leave_encashments',
} as const;
