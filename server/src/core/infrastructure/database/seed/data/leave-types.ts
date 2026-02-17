/**
 * Leave types per Philippine labor law
 * - Service Incentive Leave (SIL): 5 days for 1+ year service
 * - Special leaves: Maternity, Paternity, Solo Parent, etc.
 * Source: DOLE, Respicio & Co.
 */

export interface LeaveTypeSeedItem {
  name: string;
  code: string;
  desc1: string;
  paid: boolean;
  remarks?: string | null;
}

export const LEAVE_TYPES: LeaveTypeSeedItem[] = [
  {
    name: 'Service Incentive Leave',
    code: 'SIL',
    desc1: 'Service Incentive Leave',
    paid: true,
    remarks: '5 days for employees with at least 1 year service (Art. 95, Labor Code)',
  },
  { name: 'Sick Leave', code: 'SL', desc1: 'Sick Leave', paid: true },
  { name: 'Vacation Leave', code: 'VL', desc1: 'Vacation Leave', paid: true },
  {
    name: 'Maternity Leave',
    code: 'ML',
    desc1: 'Maternity Leave',
    paid: true,
    remarks: '105 days (RA 11210); extendible unpaid',
  },
  {
    name: 'Paternity Leave',
    code: 'PL',
    desc1: 'Paternity Leave',
    paid: true,
    remarks: '7 days (RA 8187) for legitimate child',
  },
  {
    name: 'Solo Parent Leave',
    code: 'SPL',
    desc1: 'Solo Parent Leave',
    paid: true,
    remarks: '7 days per year (RA 8972)',
  },
  {
    name: 'Bereavement Leave',
    code: 'BL',
    desc1: 'Bereavement Leave',
    paid: true,
    remarks: 'Typically 3–5 days for immediate family',
  },
  { name: 'Emergency Leave', code: 'EL', desc1: 'Emergency Leave', paid: true },
  { name: 'Study Leave', code: 'STL', desc1: 'Study Leave', paid: true },
  {
    name: 'Unpaid Leave',
    code: 'UL',
    desc1: 'Unpaid Leave',
    paid: false,
    remarks: 'Leave without pay',
  },
];
