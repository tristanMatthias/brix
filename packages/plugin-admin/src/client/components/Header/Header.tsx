import './header.scss';

import React from 'react';
import { IconType, Icon } from '../Icon/Icon';

export interface HeaderProps {
  title: string;
  icon: IconType;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  title,
  icon
}) => {
  return <header className="top">
    <Icon icon={icon} size="medium" color="grey-90" />
    <h1>{title}</h1>
  </header>;
};

