import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when educationCourseLevel data violates domain invariants or business rules
 */
export class EducationCourseLevelBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'EDUCATION_COURSE_LEVEL_BUSINESS_EXCEPTION', status_code);
    this.name = 'EducationCourseLevelBusinessException';
  }
}
