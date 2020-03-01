import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { createContainer } from 'unstated-next';

import { IconType } from '../components/Icon/Icon';
import { ActionType } from '../hooks/useAction';
import { Color } from '../lib/classes';
import { Widget } from '../lib/widgets';


export interface EAdminPageHeader {
  heading: string;
  icon?: IconType;
  buttons?: {
    action: ActionType;
    query?: string;
    color?: Color;
    icon?: IconType;
    text?: string;
  }[];
}


export interface EAdminPage {
  title: string;
  content: Widget[];
  header?: EAdminPageHeader;
}

export interface EAdminPageRoot extends EAdminPage {
  icon: IconType;
  prefix: string;
  pages?: EAdminPage[];
}


const meQuery = gql`
query {
 	adminPages {
    prefix
    icon
    title
    header {
      icon
      heading
      buttons {
        action
        icon
        text
        query
        color
      }
    }
    content {
      ...WidgetEntityGrid
    }
  }
}

fragment WidgetEntityGrid on WidgetEntityGrid {
  widget
  itemMap {
    image
    title
    subTitle
  }
  query
  queryKey
}
`;

const useAdminPages = () => {
  const [getPages, { data, error, loading, called }] = useLazyQuery<{ adminPages: EAdminPageRoot[] }>(meQuery, {});

  return {
    getPages,
    adminPages: data?.adminPages,
    loading,
    called,
    error
  };
};

export const AdminPages = createContainer(useAdminPages);
