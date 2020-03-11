import { useLazyQuery } from '@apollo/react-hooks';
import { createContainer } from 'unstated-next';

import { IconType } from '../components/Icon/Icon';
import appsQuery from '../gql/queries/adminApp.gql';
import { Action } from '../hooks/useAction';
import { Color } from '../lib/classes';
import { Widget } from '../lib/widgets';
import { SideMenuProps } from '../components/SideMenu/SideMenu';

export interface EAdminPageHeader {
  heading: string;
  icon?: IconType;
  buttons?: {
    action: Action;
    color?: Color;
    icon?: IconType;
    text?: string;
  }[];
}


export interface EAdminPage {
  path: string;
  title: string;
  content: Widget[];
  header?: EAdminPageHeader;
  pages?: EAdminPage[];
  query?: string;
  queryKey?: string;
  redirect?: string;
  menu?: SideMenuProps['items'];
}

export interface EAdminApp extends EAdminPage {
  icon: IconType;
}

const useAdminApps = () => {
  const [getPages, { data, error, loading, called }] = useLazyQuery<{ adminApps: EAdminApp[] }>(appsQuery, {});

  return {
    getPages,
    adminApps: data?.adminApps,
    loading,
    called,
    error
  };
};

export const AdminApps = createContainer(useAdminApps);
