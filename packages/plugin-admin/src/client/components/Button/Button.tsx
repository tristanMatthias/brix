import './button.scss';

import classnames from 'classnames';
import React, { HTMLProps } from 'react';

import { Action, useAction } from '../../hooks/useAction';
import { composeClass, WithColor, WithSize } from '../../lib/classes';

export type ButtonProps = HTMLProps<HTMLButtonElement> & WithColor & WithSize & {
  circle?: boolean;
  action?: Action;
  actionData?: any;
  hollow?: boolean;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  circle,
  type,
  className,
  action,
  onClick,
  hollow,
  actionData,
  ...props
}) => {
  const styles = composeClass(props, { color: 'bg', size: true }, className);
  const a = useAction(action, actionData);

  return <button
    className={classnames(styles, { circle, hollow })}
    {...props}
    onClick={e => {
      onClick?.(e);
      a?.();
    }}
  >{children}</button>;
};
