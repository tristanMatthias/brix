import { BrixContext, BrixPlugins } from '@brix/core';
import { AuthChecker } from 'type-graphql';


export const authChecker: AuthChecker<BrixContext> = async ({ context }, roles) =>
  // Loop over every auth checker to ensure authentication
  (await Promise.all(
    BrixPlugins.authCheckers.map(async checker =>
      await checker(context, roles)
    )
  )).every(r => r);
