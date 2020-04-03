import {
  BrixContext,
  BrixContextMiddleware,
  BrixContextUser,
  ErrorAuthInvalidAuthorizationHeader,
  setInCLSContext,
  verifyToken
} from '@brix/core';


/**
 * Upon a successful authentication, decrypt the access token and assign important
 * data to the context.
 * @param token Access token with users data
 * @param ctx HTTP or Subscription context to assign
 */
export const setContextFromToken = async (
  token: string,
  ctx: BrixContext
) => {
  const { user } = await verifyToken(ctx.fingerprint, token);

  ctx.user = user as BrixContextUser;
  ctx.valid = true;
  setInCLSContext('context', ctx);

  return ctx;
};


/**
 * Attempt to load the JWT from the `Authorization` header in `Bearer XYZ` format
 * @param req Express.Request
 * @param context BrixContext
 */
export const addJWTToContext: BrixContextMiddleware = (req, context) => {
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
