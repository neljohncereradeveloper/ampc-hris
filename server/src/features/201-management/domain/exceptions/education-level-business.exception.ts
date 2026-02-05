import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when education level data violates domain invariants or business rules
 */
export class EducationLevelBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'EDUCATION_LEVEL_BUSINESS_EXCEPTION', status_code);
    this.name = 'EducationLevelBusinessException';
  }
}
