import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when testTwo data violates domain invariants or business rules
 */
export class TestTwoBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'TEST_TWO_BUSINESS_EXCEPTION', status_code);
    this.name = 'TestTwoBusinessException';
  }
}
