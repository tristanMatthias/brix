import { BrixContextUser, verifyToken } from '@brix/core';
import { getStore } from '@brix/model';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';


@Resolver()
export class VerifyTokenResolver {
  User = getStore().model<BrixContextUser & { password: string }>('User');

  /** Verify a JWT */
  @Query(() => Boolean)
  verifyToken(
    @Arg('accessToken') accessToken: string,
    @Ctx('fingerprint') fingerprint: string
  ) {
    return Boolean(verifyToken(fingerprint, accessToken));
  }
}
