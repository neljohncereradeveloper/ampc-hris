import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when leave encashment data violates domain invariants or business rules
 */
export class LeaveEncashmentBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'LEAVE_ENCASHMENT_BUSINESS_EXCEPTION', status_code);
    this.name = 'LeaveEncashmentBusinessException';
  }
}
