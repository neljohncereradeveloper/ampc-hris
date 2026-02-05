import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when province data violates domain invariants or business rules
 */
export class ProvinceBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'PROVINCE_BUSINESS_EXCEPTION', status_code);
    this.name = 'ProvinceBusinessException';
  }
}
