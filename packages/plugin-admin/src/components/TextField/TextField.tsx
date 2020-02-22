import './text-field.scss';

import classname from 'classnames';
import React, { HTMLProps, MutableRefObject } from 'react';

import { Icon, IconType } from '../Icon/Icon';
import { Loader } from '../Loader/Loader';


export interface TextFieldProps extends HTMLProps<HTMLInputElement> {
  icon?: IconType;
  iconSecondary?: IconType;
  iconColor?: string;
  iconSecondaryColor?: string;
  error?: string | Error;
  suffix?: string;
  forwardRef?: MutableRefObject<HTMLInputElement | null>;
  loading?: boolean;
  initialValue?: string;
}


export const TextField: React.FunctionComponent<TextFieldProps> = ({
  icon,
  iconSecondary,
  iconColor = 'grey-30',
  iconSecondaryColor,
  className,
  error,
  disabled,
  suffix,
  loading,
  value,
  forwardRef,
  ...props
}) => {

  const [state, setState] = React.useState(0);
  const callback = React.useCallback((node: HTMLElement) => {
    if (node) return setState(node.getBoundingClientRect().width);
    setState(0);
  }, []);

  const err = error ? error.toString() : null;
  const icon2: IconType | undefined = err ? 'exclamation' : iconSecondary;
  const icon2Color = err ? 'error' : iconSecondaryColor;

  return <div className={classname('input', className, {
    loading,
    suffix,
    disabled,
    error
  })}>
    {loading
      ? <Loader />
      : icon && <Icon icon={icon} color={iconColor} />}
    {icon2 && <Icon icon={icon2} color={icon2Color} />}
    <input
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      {...props}
      value={value}
      disabled={disabled}
      style={suffix && !error ? { paddingRight: `calc(1.5rem + ${state}px)` } : {}}
    />
    {suffix && !err && <span ref={callback}>{suffix}</span>}
  </div>;
};
