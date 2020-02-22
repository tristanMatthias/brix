// import { CheckboxProps } from '../Checkbox/Checkbox.types';
// import { ColorFieldProps } from '../ColorField/ColorField.types';
import { FunctionComponent } from 'react';
import { TextFieldProps } from '../TextField/TextField';


// import { SelectProps } from '../Select/Select.types';
// import { MultiSelectProps } from '../MultiSelect/MultiSelect.types';
// import { SwitchProps } from '../switch/Switch.types';
// import { ImageFieldProps } from '../ImageField/ImageField.types';
// import { RadioTabProps } from '../RadioTabField/RadioTab.types';


export type FormFieldType =
  ({ type: 'text' | 'password' | 'number' } & TextFieldProps);
// ({ type: 'color' } & ColorFieldProps) |
// ({ type: 'checkbox' } & CheckboxProps) |
// ({ type: 'switch' } & SwitchProps) |
// ({ type: 'select' } & Omit<SelectProps, 'name'>) |
// ({ type: 'multiselect' } & Omit<MultiSelectProps, 'name'>) |
// ({ type: 'image' } & ImageFieldProps) |
// ({ type: 'radio-tab' } & RadioTabProps) |
// ({ type: 'radio' } & RadioTabProps);

export type FormFieldBaseProps = {
  name: string;
  label?: string;
  labelComponent?: React.ComponentType<any>,
  className?: string;
  colSpan?: 1 | 2;
  changeOnBlur?: boolean;
};

export type FormFieldProps = FormFieldBaseProps & (FormFieldType | {
  component?: React.ComponentType | FunctionComponent<any>,
  [prop: string]: any
});

