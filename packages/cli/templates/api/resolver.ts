import { Arg, Query, Resolver } from 'type-graphql';

import { UserService } from '../../services/User.service';
import { EUser } from '../entities/User.entity';


@Resolver(EUser)
export class UserResolver {

  @Query(() => EUser)
  async user(
    @Arg('id') id: string
  ) {
    return UserService.find(id);
  }

  @Query(() => [EUser])
  async users() {
    return UserService.list();
  }
}
