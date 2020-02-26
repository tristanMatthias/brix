import { Query, Resolver, Authorized } from 'type-graphql';

import { EMock } from '../entities/Mock.entity';

@Resolver(EMock)
export class MockResolver {
  @Query(() => [EMock])
  mocks() {
    return [{ test: 1 }];
  }

  @Query(() => EMock)
  @Authorized()
  authedMock() {
    return { test: 1 };
  }
}
