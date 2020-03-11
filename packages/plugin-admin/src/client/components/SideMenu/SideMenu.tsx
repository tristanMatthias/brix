import './side-menu.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { IconType, Icon } from '../Icon/Icon';
import { CONFIG } from '../../config';

export interface SideMenuProps {
  prefix?: string;
  items: {
    to: string;
    text: string;
    icon?: IconType
  }[];
}

export const SideMenu: React.FunctionComponent<SideMenuProps> = ({
  prefix = CONFIG.prefix,
  items
}) => <nav className="side-menu">
    {items.map((item, i) => <NavLink to={`${prefix}${item.to}`} key={i} exact>
      {item.icon && <Icon icon={item.icon} />}
      <span>{item.text}</span>
    </NavLink>)}
  </nav>;
