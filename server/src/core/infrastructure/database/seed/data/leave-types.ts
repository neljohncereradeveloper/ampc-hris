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
    name: 'service incentive Leave',
    code: 'sil',
    desc1: 'service incentive leave',
    paid: true,
    remarks:
      '5 days for employees with at least 1 year service (art. 95, labor code)',
  },
  { name: 'sick leave', code: 'sl', desc1: 'sick leave', paid: true },
  { name: 'vacation leave', code: 'vl', desc1: 'vacation leave', paid: true },
  {
    name: 'maternity leave',
    code: 'ml',
    desc1: 'maternity leave',
    paid: true,
    remarks: '105 days (ra 11210); extendible unpaid',
  },
  {
    name: 'paternity leave',
    code: 'pl',
    desc1: 'paternity leave',
    paid: true,
    remarks: '7 days (ra 8187) for legitimate child',
  },
  {
    name: 'solo parent leave',
    code: 'spl',
    desc1: 'solo parent leave',
    paid: true,
    remarks: '7 days per year (ra 8972)',
  },
  {
    name: 'bereavement leave',
    code: 'bl',
    desc1: 'bereavement leave',
    paid: true,
    remarks: 'Typically 3–5 days for immediate family',
  },
  { name: 'emergency leave', code: 'el', desc1: 'emergency leave', paid: true },
  { name: 'study leave', code: 'stl', desc1: 'study leave', paid: true },
  {
    name: 'unpaid leave',
    code: 'ul',
    desc1: 'unpaid leave',
    paid: false,
    remarks: 'leave without pay',
  },
];
