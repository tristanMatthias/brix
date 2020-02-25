import { GraphQLJSON, GraphQLUpload, FileUpload } from '@brix/core';
import { FieldType, Model, ModelField } from '@brix/model';
import { Field, InputType, ObjectType } from 'type-graphql';


@InputType()
export class ECreateMediaInput {
  @Field(() => GraphQLUpload)
  image: FileUpload;
}

@InputType()
export class EUpdateMediaInput extends ECreateMediaInput {
  @Field()
  id: string;
}


@Model('Media')
@ObjectType()
export class EMedia {
  @Field()
  id: string;

  @Field()
  @ModelField()
  name: string;

  @Field()
  @ModelField()
  url: string;

  @Field()
  @ModelField()
  ext: string;

  @Field()
  @ModelField({ nullable: true, default: 'filesystem' })
  provider: string;

  @Field()
  @ModelField()
  author: string;

  @Field(() => GraphQLJSON)
  @ModelField({ nullable: true, type: FieldType.JSON })
  providerInfo: object;
}
