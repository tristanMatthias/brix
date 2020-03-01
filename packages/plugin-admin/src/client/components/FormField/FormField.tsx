import './form-field.scss';

import classnames from 'classnames';
import { FormikHandlers, getIn, useField, useFormikContext } from 'formik';
import React, { useMemo } from 'react';

import { Checkbox } from '../Checkbox/Checkbox';
import { useBrixFormContext } from '../Form/Form';
import { TextField } from '../TextField/TextField';
import { FormFieldProps } from './FormField.types';
import { firstUpper } from '../../lib/text';

// import { OptionProps } from 'react-select';
// import { ColorField } from '../ColorField/ColorField';
// import { DateField } from '../DateField/DateField';
// import { EntityImageField, ImageField } from '../ImageField/ImageField';
// import { MultiSelect } from '../MultiSelect/MultiSelect';
// import { Radio } from '../RadioField/Radio';
// import { RadioTab } from '../RadioTabField/RadioTab';
// import { Select } from '../Select/Select';
// import { Switch } from '../switch/Switch';
// import { TimeField } from '../TimeField/TimeField';


export const FormField: React.FunctionComponent<FormFieldProps> = ({
  name,
  label,
  labelComponent,
  className,
  colSpan = 2,
  changeOnBlur,
  onChange: overridenOnChange,
  ...compProps
}) => {
  const [fieldFormik] = useField(name);
  const form = useFormikContext<any>();
  const brixForm = useBrixFormContext();
  const value = getIn(form.values, name);

  const onChange: FormikHandlers['handleChange'] = (e: any) => {
    form.setFieldTouched(name);
    fieldFormik.onChange(e);
  };

  useMemo(() => {
    if (
      brixForm &&
      brixForm.onChange &&
      form.touched[name] &&
      !changeOnBlur
    ) brixForm.onChange(form.values, form);
  }, [value]);


  let error;
  if (name === 'time' && getIn(form.errors, name)) {
    if (getIn(form.touched.time, 'hours') && getIn(form.touched.time, 'minutes')) {
      error = Object.values(getIn(form.errors, name))[0];
    }
  } else {
    error = getIn(form.errors, name) && (form.submitCount > 0 || getIn(form.touched, name))
      ? getIn(form.errors, name)
      : null;
  }

  const extraProps: any = { error };

  if (changeOnBlur) {
    extraProps.onBlur = () => brixForm.onChange(form.values, form);
  }

  let Comp;
  if ('type' in compProps) {
    const type = compProps.type;

    switch (type) {
      case 'text':
      case 'number':
      case 'password':
        Comp = TextField;
        extraProps.type = type;
        break;

      // case 'color':
      //   Comp = ColorField;
      //   break;

      // case 'time':
      //   Comp = TimeField;
      //   extraProps.onChange = (e: React.ChangeEvent<HTMLInputElement | any>) => {
      //     form.setFieldTouched(e.target.name);
      //     form.setFieldValue(e.target.name,
      //       e.target.value === ''
      //         ? undefined
      //         : e.target.name.includes('ampm')
      //           ? e.target.value
      //           : parseInt(e.target.value));
      //   };
      //   break;

      // case 'date':
      //   Comp = DateField;
      //   extraProps.onChange = (e: any) => {
      //     form.setFieldValue(e.target.name, e.target.value);
      //   };
      //   break;

      case 'checkbox':
        Comp = Checkbox;
        extraProps.defaultChecked = Boolean(fieldFormik!.value);
        break;

      // case 'switch':
      //   Comp = Switch;
      //   extraProps.form = form;
      //   // @ts-ignore
      //   if (compProps.label2) {
      //     extraProps.label = label;
      //     label = undefined;
      //   }
      //   break;

      // case 'select':
      //   Comp = Select;
      //   break;

      // case 'multiselect':
      //   Comp = MultiSelect;
      //   extraProps.onChange = (opts: OptionProps<{ value: number | string }>[]) => {
      //     form.setFieldTouched(name);
      //     form.setFieldValue(name, opts);
      //   };
      //   break;

      // case 'image':
      //   Comp = ImageField;
      //   extraProps.form = form;
      //   break;

      // case 'entity-image':
      //   Comp = EntityImageField;
      //   extraProps.form = form;
      //   break;

      // case 'radio-tab':
      //   Comp = RadioTab;
      //   extraProps.form = form;
      //   break;

      // case 'radio':
      //   Comp = Radio;
      //   extraProps.form = form;
      //   break;

      default:
        throw new Error(`Could not find field type for '${type}'`);
    }
  } else {
    Comp = compProps.component;
  }

  const LC = labelComponent;

  return <div className={classnames('form-field', className, {
    [`col-span-${colSpan}`]: colSpan !== 2
  })}>
    {label &&
      (LC ? <LC htmlFor={name}>{label}</LC> : <label htmlFor={name}>{firstUpper(label)}</label>)
    }
    {Comp ? <Comp
      id={name}
      {...fieldFormik}
      {...compProps as any}
      {...extraProps}
      // TODO Refactor fix this
      onChange={overridenOnChange || extraProps.onChange || onChange}
    /> : null}
    {typeof error === 'string' && <span className="error">{firstUpper(error)}</span>}
  </div>;
};
