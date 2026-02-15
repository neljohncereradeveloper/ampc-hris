/**
 * Type of a leave transaction (audit trail for every balance change).
 *
 * Each type has a **sign rule** for the `days` field:
 * - **REQUEST** and **ENCASHMENT**: days must be **negative** (debit = balance goes down).
 * - **CARRY**: days must be **positive** (credit = balance goes up).
 * - **ADJUSTMENT**: days can be **positive or negative** (used for reversals and corrections).
 *
 * @example Flow examples
 * | Action                    | Type        | days sign | Meaning              |
 * |---------------------------|-------------|-----------|----------------------|
 * | Approve leave (3 days)    | REQUEST     | negative  | Balance −3           |
 * | Cancel approved (3 days) | ADJUSTMENT  | positive  | Balance +3 (reversal)|
 * | Encash leave (2 days)     | ENCASHMENT  | negative  | Balance −2           |
 * | Carry-over from last year| CARRY       | positive  | Balance +5           |
 */
export enum EnumLeaveTransactionType {
  /**
   * Leave **consumed** by an approved leave request.
   * Days must be **negative** (debit). Recorded when a manager approves a leave request; balance decreases.
   * @example Approve 3 days → REQUEST, days = -3
   */
  REQUEST = 'request',

  /**
   * Leave **converted to pay** (encashment).
   * Days must be **negative** (debit). Recorded when an encashment is processed; balance decreases.
   * @example Encash 2 days → ENCASHMENT, days = -2
   */
  ENCASHMENT = 'encashment',

  /**
   * **Correction or reversal** (e.g. cancel an approved request, manual adjustment).
   * Days can be **positive or negative**. Positive = put days back; negative = take days (manual debit).
   * @example Cancel approved 3 days → ADJUSTMENT, days = +3 (reversal)
   */
  ADJUSTMENT = 'adjustment',

  /**
   * Days **carried over** from the previous leave year.
   * Days must be **positive** (credit). Recorded at year start or when applying carry-over rules.
   * @example Carry 5 days from last year → CARRY, days = +5
   */
  CARRY = 'carry',
}
