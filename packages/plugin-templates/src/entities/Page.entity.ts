import { GraphQLJSON } from '@brix/core';
import { FieldType, Model, ModelField } from '@brix/model';
import { Field, InputType, ObjectType } from 'type-graphql';
import { User } from '@brix/plugin-entity-user';
import { ETemplate } from './Template.entity';


@InputType()
export class ECreatePageInput {
  @Field({ nullable: false })
  url: string;

  @Field({ nullable: false })
  title: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: object;

  @Field()
  templateUrl: string;
}


@InputType()
export class EUpdatePageInput extends ECreatePageInput {
  @Field()
  id: string;
}


@Model('Page')
@ObjectType()
export class EPage {
  @Field()
  id: string;

  @Field({ nullable: false })
  @ModelField({ nullable: false })
  url: string;

  @Field({ nullable: false })
  @ModelField({ nullable: false })
  title: string;

  @Field(() => GraphQLJSON, { nullable: false })
  @ModelField({ nullable: false, type: FieldType.JSON, default: {} })
  data: object;

  @ModelField()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field()
  @ModelField({ type: FieldType.STRING })
  templateUrl: string;

  @Field(() => ETemplate)
  template: string;

  @Field()
  @ModelField()
  createdAt: Date;

  @Field()
  @ModelField()
  updatedAt: Date;
}
