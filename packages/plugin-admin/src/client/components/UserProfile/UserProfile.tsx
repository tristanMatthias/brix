import './user-profile.scss';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { Me } from '../../containers/Me.container';
import { routes } from '../../router/routes';
import { Tooltip } from '../Tooltip/Tooltip';
import { Icon } from '../Icon/Icon';

export const UserProfile: React.FunctionComponent = () => {
  const { me } = Me.useContainer();
  if (!me) return null;

  return <Tooltip
    placement="right"
    overlay={<nav className="user-profile-tooltip">
      <NavLink to={routes.logout()}>
        <Icon icon="logout" />
        <span>Logout</span>
      </NavLink>
    </nav>}
  >
    <div className="user-profile">
      <div className="circle">
        <span>{me.firstName[0]}{me.lastName[0]}</span>
      </div>
    </div>
  </Tooltip>;
};

