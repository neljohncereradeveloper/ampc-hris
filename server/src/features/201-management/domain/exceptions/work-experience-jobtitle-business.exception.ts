import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when work experience job title data violates domain invariants or business rules
 */
export class WorkExperienceJobTitleBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'WORK_EXPERIENCE_JOBTITLE_BUSINESS_EXCEPTION', status_code);
    this.name = 'WorkExperienceJobTitleBusinessException';
  }
}
