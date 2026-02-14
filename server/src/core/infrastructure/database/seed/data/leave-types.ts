/**
 * Leave types per Philippine labor law
 * - Service Incentive Leave (SIL): 5 days for 1+ year service
 * - Special leaves: Maternity, Paternity, Solo Parent, etc.
 * Source: DOLE, Respicio & Co.
 */

export const LEAVE_TYPES = [
  { name: 'Service Incentive Leave', code: 'SIL', desc1: 'Service Incentive Leave', paid: true },
  { name: 'Sick Leave', code: 'SL', desc1: 'Sick Leave', paid: true },
  { name: 'Vacation Leave', code: 'VL', desc1: 'Vacation Leave', paid: true },
  { name: 'Maternity Leave', code: 'ML', desc1: 'Maternity Leave', paid: true },
  { name: 'Paternity Leave', code: 'PL', desc1: 'Paternity Leave', paid: true },
  { name: 'Solo Parent Leave', code: 'SPL', desc1: 'Solo Parent Leave', paid: true },
  { name: 'Bereavement Leave', code: 'BL', desc1: 'Bereavement Leave', paid: true },
  { name: 'Emergency Leave', code: 'EL', desc1: 'Emergency Leave', paid: true },
  { name: 'Study Leave', code: 'STL', desc1: 'Study Leave', paid: true },
  { name: 'Unpaid Leave', code: 'UL', desc1: 'Unpaid Leave', paid: false },
] as const;
