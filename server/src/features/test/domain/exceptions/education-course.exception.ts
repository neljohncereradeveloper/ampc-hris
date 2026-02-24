import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when educationCourse data violates domain invariants or business rules
 */
export class EducationCourseBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'EDUCATION_COURSE_BUSINESS_EXCEPTION', status_code);
    this.name = 'EducationCourseBusinessException';
  }
}
