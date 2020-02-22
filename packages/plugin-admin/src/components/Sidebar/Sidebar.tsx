import './sidebar.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';

import Logo from '../../images/logo-mark.svg';
import { routes } from '../../router/routes';
import { UserProfile } from '../UserProfile/UserProfile';
import { Icon, IconType } from '../Icon/Icon';

const sidebarLinks: { [url: string]: IconType } = {
  [routes.users()]: 'userLine'
};

export const Sidebar = () => {
  return <aside className="sidebar">
    <NavLink exact to={routes.home()} className="logo"><Logo /></NavLink>
    <nav>
      {Object.entries(sidebarLinks).map(([to, icon]) => <NavLink to={to}>
        <Icon icon={icon} size="medium" />
      </NavLink>)}
    </nav>
    <UserProfile />
  </aside>;
};
