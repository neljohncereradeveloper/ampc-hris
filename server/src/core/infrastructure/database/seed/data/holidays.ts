/**
 * Philippine holidays 2026 (Regular + Special Non-Working)
 * Source: Proclamation 1006 (Sept 3, 2025), Official Gazette
 * Eid'l Fitr and Eid'l Adha announced separately (Islamic calendar)
 * Update: https://officialgazette.gov.ph/nationwide-holidays
 */

export const HOLIDAYS_2026 = [
  { name: "New Year's Day", date: '2026-01-01', type: 'Regular', is_recurring: true },
  { name: 'Chinese New Year', date: '2026-02-17', type: 'Special', is_recurring: false },
  { name: 'Maundy Thursday', date: '2026-04-02', type: 'Regular', is_recurring: false },
  { name: 'Good Friday', date: '2026-04-03', type: 'Regular', is_recurring: false },
  { name: 'Black Saturday', date: '2026-04-04', type: 'Special', is_recurring: false },
  { name: 'Araw ng Kagitingan (Day of Valor)', date: '2026-04-09', type: 'Regular', is_recurring: true },
  { name: 'Labor Day', date: '2026-05-01', type: 'Regular', is_recurring: true },
  { name: 'Independence Day', date: '2026-06-12', type: 'Regular', is_recurring: true },
  { name: 'Ninoy Aquino Day', date: '2026-08-21', type: 'Special', is_recurring: true },
  { name: 'National Heroes Day', date: '2026-08-31', type: 'Regular', is_recurring: false },
  { name: "All Saints' Day", date: '2026-11-01', type: 'Special', is_recurring: true },
  { name: "All Souls' Day", date: '2026-11-02', type: 'Special', is_recurring: true },
  { name: 'Bonifacio Day', date: '2026-11-30', type: 'Regular', is_recurring: true },
  { name: 'Feast of the Immaculate Conception of Mary', date: '2026-12-08', type: 'Special', is_recurring: true },
  { name: 'Christmas Eve', date: '2026-12-24', type: 'Special', is_recurring: true },
  { name: 'Christmas Day', date: '2026-12-25', type: 'Regular', is_recurring: true },
  { name: 'Rizal Day', date: '2026-12-30', type: 'Regular', is_recurring: true },
  { name: 'Last Day of the Year', date: '2026-12-31', type: 'Special', is_recurring: true },
];
