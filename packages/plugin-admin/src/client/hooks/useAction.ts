import gql from 'graphql-tag';
import { useHistory } from 'react-router';

import { EAdminPageHeader } from '../containers/AdminApps.container';
import { getFile } from '../lib/getFile';
import { useUpload } from './useUpload';
import { linkParams } from '../router/routes';
import { dotObjString } from '../lib/dotObjString';


export type ActionType =
  'link' |
  'upload';

export interface ActionLink {
  action: 'link';
  to: string;
}
export interface ActionUpload {
  action: 'upload';
  query: string;
}

export type Action = ActionLink | ActionUpload;

export function useAction(action: Action, _data?: object): Function {
  switch (action.action) {
    case 'upload':
      const { upload } = useUpload(gql(action.query));
      return () => getFile(upload);

    case 'link':
      const h = useHistory();
      return (linkData: any) => {
        const parsed = linkData ? dotObjString(action.to, linkData) : action.to;
        h.push(linkParams(parsed)());
      };

    default:
      throw new Error(`Unknown action '${action}'`);
  }
}

export function useActions(buttons: EAdminPageHeader['buttons']) {
  return (buttons ?? []).map(b => useAction(b.action));
}
