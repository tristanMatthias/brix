import { Model, ModelField } from '@brix/model';
import { Store } from '@brix/model/dist/Store';
import { Arg, Field, InputType, Mutation, ObjectType, Query, Resolver, Authorized, Ctx } from 'type-graphql';
import { hashPassword, BrixContext } from '@brix/core';


@ObjectType()
@Model()
export class User {
  @Field()
  id: string;

  @Field()
  @ModelField()
  firstName: string;

  @Field()
  @ModelField()
  lastName: string;

  @Field()
  @ModelField()
  email: string;

  @ModelField()
  password: string;
}


@InputType()
export class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}


@Resolver(User)
export class UserResolver {
  model = Store.model<User>('User');

  @Query(() => [User])
  @Authorized()
  async users() {
    return this.model.findAll();
  }

  // TODO: Make more secure and only run once
  @Mutation(() => User)
  async signup(
    @Arg('user', () => UserInput) user: UserInput
  ) {
    user.password = await hashPassword(user.password);
    return this.model.create(user);
  }

  /** Get the current user */
  @Query(() => User)
  @Authorized()
  me(@Ctx() ctx: BrixContext) {
    return this.model.findById(ctx.user!.id);
  }
}
