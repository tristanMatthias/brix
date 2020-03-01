import './button.scss';

import React, { HTMLProps } from 'react';
import classnames from 'classnames';
import { WithColor, WithSize, composeClass } from '../../lib/classes';

export type ButtonProps = HTMLProps<HTMLButtonElement> & WithColor & WithSize & {
  circle?: boolean;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  circle,
  type,
  className,
  ...props
}) => {
  const styles = composeClass(props, { color: 'bg', size: true }, className);
  return <button
    className={classnames(styles, { circle })}
    {...props}
  >{children}</button>;
};
