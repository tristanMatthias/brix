import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class PaginationArgs {
  @Field()
  offset: number = 0;

  @Field()
  limit: number = 50;
}
