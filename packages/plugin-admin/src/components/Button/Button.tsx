import './button.scss';

import React, { HTMLProps } from 'react';

export interface ButtonProps extends HTMLProps<HTMLButtonElement> { }

export const Button: React.FunctionComponent<ButtonProps> = ({
  children,
  type,
  ...props
}) => {
  return <button {...props}>{children}</button>;
};
