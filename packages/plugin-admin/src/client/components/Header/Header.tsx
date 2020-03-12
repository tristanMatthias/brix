import './header.scss';

import React from 'react';

import { EAdminPageHeader } from '../../containers/AdminApps.container';
import { Button } from '../Button/Button';
import { Icon, IconType } from '../Icon/Icon';
import { useActions } from '../../hooks/useAction';

export interface HeaderProps {
  title: string;
  icon: IconType;
  buttons?: EAdminPageHeader['buttons'];
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  buttons,
  title,
  icon
}) => {
  const actions = useActions(buttons ?? []);

  return <header className="top">
    <Icon icon={icon} size="medium" color="main" />
    <h1>{title}</h1>
    {(buttons && (buttons.length > 0)) && <div className="button-group">
      {buttons.map(({
        icon,
        text,
        action,
        ...props
      }, i) => <Button onClick={() => actions[i]!()} {...props}>
          {icon && <Icon icon={icon} />}
          {text && <span>{text}</span>}
        </Button>)}
    </div>}
  </header>;
};

