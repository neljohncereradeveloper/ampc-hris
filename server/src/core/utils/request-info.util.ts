export interface RequestInfo {
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  user_name: string;
  /** Authenticated user ID (from auth context). Optional; set when request is authenticated. */
  user_id?: number;
}

/**
 * Creates a RequestInfo object from a NestJS/Express Request object
 * @param request - The NestJS Request object (or any object with user, ip, headers, sessionId)
 * @returns RequestInfo object with user_name, user_id, ip_address, user_agent, and session_id
 */
export function createRequestInfo(request: any): RequestInfo {
  const rawId =
    request?.user?.id ?? request?.user?.sub ?? request?.user?.userId;
  const parsed = rawId != null ? Number(rawId) : NaN;
  const user_id = Number.isNaN(parsed) ? undefined : parsed;
  return {
    user_name: request?.user?.username ?? request?.user?.name ?? 'system',
    user_id,
    ip_address: request?.ip,
    user_agent:
      typeof request?.headers?.['user-agent'] === 'string'
        ? request.headers['user-agent']
        : undefined,
    session_id: request?.sessionId,
  };
}
