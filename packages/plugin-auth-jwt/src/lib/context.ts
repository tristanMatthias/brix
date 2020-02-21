import { BrixContext, BrixContextUser, setInCLSContext } from '@brix/core';

import { verifyToken } from './tokens';

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
