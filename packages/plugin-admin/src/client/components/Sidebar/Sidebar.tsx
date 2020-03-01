import './sidebar.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { AdminPages } from '../../containers/AdminPages.container';
import Logo from '../../images/logo-mark.svg';
import { linkParams, routes } from '../../router/routes';
import { Icon, IconType } from '../Icon/Icon';
import { UserProfile } from '../UserProfile/UserProfile';


const sidebarLinks: { [url: string]: IconType } = {
  [routes.users()]: 'userLine'
};

export const Sidebar = () => {
  const { adminPages } = AdminPages.useContainer();

  return <aside className="sidebar">
    <NavLink exact to={routes.home()} className="logo"><Logo /></NavLink>
    <nav>
      {Object.entries(sidebarLinks).map(([to, icon]) => <NavLink key={to} to={to}>
        <Icon icon={icon} size="medium" />
      </NavLink>)}
      {adminPages?.map(p => <NavLink key={p.prefix} to={linkParams(p.prefix)()}>
        <Icon icon={p.icon as IconType} size="medium" />
      </NavLink>)}
    </nav>
    <UserProfile />
  </aside>;
};
