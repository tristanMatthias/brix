import gql from 'graphql-tag';
import { useHistory } from 'react-router';

import { EAdminPageHeader } from '../containers/AdminApps.container';
import { Picker, PickerProps } from '../containers/Picker.container';
import { dotObjString } from '../lib/dotObjString';
import { getFile } from '../lib/getFile';
import { linkParams } from '../router/routes';
import { useUpload } from './useUpload';

export interface ActionLink {
  action: 'link';
  to: string;
}
export interface ActionUpload {
  action: 'upload';
  query: string;
}
export interface ActionPick extends PickerProps {
  action: 'pick';
}

export type Action = ActionLink | ActionUpload | ActionPick;

export function useAction(action?: Action, data?: any): Function | undefined {
  if (!action) return;

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

    case 'pick':
      const { open } = Picker.useContainer();
      return () => open({ ...action }, data);

    default:
      // @ts-ignore
      throw new Error(`Unknown action '${action.action}'`);
  }
}

export function useActions(buttons: EAdminPageHeader['buttons']) {
  return (buttons ?? []).map(b => useAction(b.action));
}
