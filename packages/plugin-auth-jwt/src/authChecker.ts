import { BrixAuthChecker, ErrorAuthUnauthenticated } from '@brix/core';

import { setContextFromToken } from './lib/context';


/**
 * Verify a request via the JWT:
 * 1. Verify a JWT
 * 2. Assign JWT data to context
 * 3. If no role needed, succeed
 * 4. If role needed, compare against users role
 */
export const authChecker: BrixAuthChecker = async (context, roles) => {
  // If unauthenticated, throw 400 error
  if (!context.accessToken) throw new ErrorAuthUnauthenticated();
  // Attempt to decrypt and verify the accessToken and assign data to context
  const { role } = await setContextFromToken(context.accessToken, context);
  // No need to check against role permissions, as there is none
  if (roles.length === 0) return true;
  // If a role is required, return false
  if (!role) return false;
  // Return if user's role is high enough
  return roles.includes(role);
};
