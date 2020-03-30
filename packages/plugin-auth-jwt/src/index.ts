import { ErrorAuthInvalidAuthorizationHeader, ErrorAuthUnauthenticated } from '@brix/api';
import { BrixAuthChecker, BrixContextMiddleware, BrixPlugins } from '@brix/core';
import { AuthResolver } from './Auth.resolver';
import { setContextFromToken } from './lib/context';



/**
 * Attempt to load the JWT from the `Authorization` header in `Bearer XYZ` format
 * @param req Express.Request
 * @param context BrixContext
 */
const addJWTToContext: BrixContextMiddleware = (req, context) => {
  let accessToken = req.headers.authorization;

  if (accessToken) {
    try {
      [, accessToken] = /^Bearer\s(.+)$/.exec(accessToken)!;
      if (!accessToken.length) throw new ErrorAuthInvalidAuthorizationHeader();
    } catch (e) {
      throw new ErrorAuthInvalidAuthorizationHeader();
    }
  }

  context.accessToken = accessToken;
  return context;
};


/**
 * Verify a request via the JWT:
 * 1. Verify a JWT
 * 2. Assign JWT data to context
 * 3. If no role needed, succeed
 * 4. If role needed, compare against users role
 */
const authChecker: BrixAuthChecker = async (context, roles) => {
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

export default () => {
  BrixPlugins.register({
    name: 'Auth - JWT',
    description: 'JWT authentication in Brix',
    contextMiddlewares: [addJWTToContext],
    authCheckers: [authChecker],
    resolvers: [AuthResolver]
  });
};
