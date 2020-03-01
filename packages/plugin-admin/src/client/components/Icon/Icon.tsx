import './icon.scss';

import classnames from 'classnames';
import React, { PropsWithRef } from 'react';

import { icons } from './icons';


export type IconType = keyof typeof icons;

export interface IconProps extends PropsWithRef<any> {
  icon: IconType;
  color?: string;
  size?: 'large' | 'small' | 'medium';
}


export const Icon: React.FunctionComponent<IconProps> = ({
  icon,
  color,
  size,
  ...props
}) => {
  const sizeClass = size ? `is-${size}` : null;
  const colorClass = color ? `color-${color}` : null;
  const klass = classnames('icon', props.className, sizeClass, colorClass);
  const Ikon = icons[icon];
  return <Ikon {...props} className={klass} />;
};
