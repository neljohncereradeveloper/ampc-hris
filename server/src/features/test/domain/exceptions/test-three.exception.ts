import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when testThree data violates domain invariants or business rules
 */
export class TestThreeBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'TEST_THREE_BUSINESS_EXCEPTION', status_code);
    this.name = 'TestThreeBusinessException';
  }
}
