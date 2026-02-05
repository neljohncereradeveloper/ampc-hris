import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when work experience company data violates domain invariants or business rules
 */
export class WorkExperienceCompanyBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'WORK_EXPERIENCE_COMPANY_BUSINESS_EXCEPTION', status_code);
    this.name = 'WorkExperienceCompanyBusinessException';
  }
}
