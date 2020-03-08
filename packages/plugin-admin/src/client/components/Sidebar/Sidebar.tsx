import './sidebar.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { AdminApps } from '../../containers/AdminApps.container';
import Logo from '../../images/logo-mark.svg';
import { linkParams, routes } from '../../router/routes';
import { Icon, IconType } from '../Icon/Icon';
import { UserProfile } from '../UserProfile/UserProfile';


const sidebarLinks: { [url: string]: IconType } = {
  [routes.users()]: 'userLine'
};

export const Sidebar = () => {
  const { adminApps } = AdminApps.useContainer();


  return <aside className="sidebar">
    <NavLink exact to={routes.home()} className="logo"><Logo /></NavLink>
    <nav>
      {Object.entries(sidebarLinks).map(([to, icon]) => <NavLink key={to} to={to}>
        <Icon icon={icon} size="medium" />
      </NavLink>)}
      {adminApps?.map(p => <NavLink key={p.path} to={linkParams(p.path)()}>
        <Icon icon={p.icon} size="medium" />
      </NavLink>)}
    </nav>
    <UserProfile />
  </aside>;
};
