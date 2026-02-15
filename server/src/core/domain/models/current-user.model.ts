/**
 * Current User interface
 * Represents the authenticated user attached to the request.
 * Returned by JwtStrategy.validate() and attached to request.user.
 * Used by createRequestInfo() to set RequestInfo.user_id and RequestInfo.user_name.
 */
export interface CurrentUser {
  /** User primary key; required for RequestInfo.user_id (audit, leave cancel/approve, etc.). */
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: Date | null;
}
