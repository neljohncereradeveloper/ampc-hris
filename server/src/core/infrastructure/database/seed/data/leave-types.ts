/**
 * Leave types per Philippine labor law
 * - Service Incentive Leave (SIL): 5 days for 1+ year service
 * - Special leaves: Maternity, Paternity, Solo Parent, etc.
 * Source: DOLE, Respicio & Co.
 */

export const LEAVE_TYPES = [
  'Service Incentive Leave',
  'Sick Leave',
  'Vacation Leave',
  'Maternity Leave',
  'Paternity Leave',
  'Solo Parent Leave',
  'Bereavement Leave',
  'Emergency Leave',
  'Study Leave',
  'Unpaid Leave',
] as const;
