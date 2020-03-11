import { FieldType, Model, ModelField } from '@brix/model';
import { Field, InputType, ObjectType } from 'type-graphql';


@InputType()
export class EMenuItemInput {
  @Field()
  pageId: string;

  @Field()
  text: string;

  @Field(() => [EMenuItemInput], { nullable: true })
  items?: EMenuItemInput[];
}

@ObjectType()
export class EMenuItem {
  @Field()
  pageId: string;

  @Field()
  text: string;

  @Field(() => [EMenuItem], { nullable: true })
  items?: EMenuItem[];
}

@InputType()
export class ECreateMenuInput {
  @Field()
  name: string;

  @Field(() => [EMenuItemInput])
  items: EMenuItemInput[];
}


@InputType()
export class EUpdateMenuInput extends ECreateMenuInput {
  @Field()
  id: string;
}


@Model('Menu')
@ObjectType()
export class EMenu {
  @Field()
  id: string;

  @Field()
  @ModelField()
  name: string;

  @Field(() => [EMenuItem])
  @ModelField({ type: FieldType.JSON })
  items: EMenuItem[];
}
