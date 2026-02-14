import { HTTP_STATUS } from '@/core/domain/constants';
import { DomainException } from '@/core/domain/exceptions/domain.exception';

/**
 * Thrown when leave year configuration data violates domain invariants or business rules
 */
export class LeaveYearConfigurationBusinessException extends DomainException {
  constructor(message: string, status_code: number = HTTP_STATUS.BAD_REQUEST) {
    super(message, 'LEAVE_YEAR_CONFIGURATION_BUSINESS_EXCEPTION', status_code);
    this.name = 'LeaveYearConfigurationBusinessException';
  }
}
