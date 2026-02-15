/**
 * Activity log action names for leave-request use cases.
 */
export const LEAVE_REQUEST_ACTIONS = {
  CREATE: 'CREATE_LEAVE_REQUEST',
  UPDATE: 'UPDATE_LEAVE_REQUEST',
  PAGINATED_LIST: 'PAGINATED_LIST_LEAVE_REQUEST',
  APPROVE: 'APPROVE_LEAVE_REQUEST',
  REJECT: 'REJECT_LEAVE_REQUEST',
  CANCEL: 'CANCEL_LEAVE_REQUEST',
} as const;


export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];