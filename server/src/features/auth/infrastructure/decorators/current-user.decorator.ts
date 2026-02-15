import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUser as CurrentUserType } from '@/core/domain/models';

/**
 * Current User Decorator
 * Extracts the authenticated user from the request object (set by JwtStrategy).
 * Use in controllers to get the current user; id and username are used by createRequestInfo for audit.
 *
 * @example
 * ```ts
 * @Get('profile')
 * async getProfile(@CurrentUser() user: CurrentUserType) {
 *   return user; // { id, username, email, first_name, last_name, ... }
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
