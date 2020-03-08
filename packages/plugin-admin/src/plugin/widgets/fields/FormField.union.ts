import { createUnionType, Field, ObjectType } from 'type-graphql';
import { WidgetButton } from '../Button.widget';
import { WidgetQuery } from '../Query.widget';


// ------------------------------------------------------------------------ Base
@ObjectType()
export class WidgetFormFieldBase {
  @Field()
  name: string;

  @Field({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  default?: string;
}


// ------------------------------------------------------------------------ Text
@ObjectType()
export class WidgetFormFieldText extends WidgetFormFieldBase {
  @Field()
  widget: 'input';

  @Field()
  type: 'text' | 'number' | 'color' | 'email' | 'textarea' | 'hidden' | 'textarea';

  @Field({ nullable: true })
  placeholder?: string;
}


// -------------------------------------------------------------------- Checkbox
@ObjectType()
export class WidgetFormFieldCheckbox extends WidgetFormFieldBase {
  @Field()
  widget: 'checkbox';
}


// ---------------------------------------------------------------------- Select
@ObjectType()
export class WidgetFormFieldSelectOption {
  @Field()
  label: string;

  @Field({ nullable: true })
  value?: string;

  @Field({ nullable: true })
  selected?: boolean;

  @Field({ nullable: true })
  disabled?: boolean;
}

@ObjectType()
export class WidgetFormFieldSelect extends WidgetFormFieldBase {
  @Field()
  widget: 'select';

  @Field(() => [WidgetFormFieldSelectOption])
  options: WidgetFormFieldSelectOption[];
}


// ------------------------------------------------------------------ Form Field
export type WidgetFormField =
  WidgetFormFieldText |
  WidgetFormFieldCheckbox |
  WidgetFormFieldSelect |
  WidgetButton |
  WidgetQuery;

// ----------------------------------------------------------------------- Union
export const WidgetFormFieldUnion = createUnionType({
  name: 'WidgetFormField',
  types: [
    WidgetFormFieldText,
    WidgetFormFieldCheckbox,
    WidgetFormFieldSelect,
    WidgetButton,
    WidgetQuery
  ],
  resolveType: value => {
    switch (value.widget) {
      case 'input':
        return WidgetFormFieldText;
      case 'checkbox':
        return WidgetFormFieldCheckbox;
      case 'select':
        return WidgetFormFieldSelect;
      case 'button':
        return WidgetButton;
      case 'query':
        return WidgetQuery;
      default:
        return null;
    }
  }
});
