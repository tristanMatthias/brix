import gql from 'graphql-tag';
import { EAdminPageHeader } from '../containers/AdminPages.container';
import { useUpload } from './useUpload';
import { getFile } from '../lib/getFile';


export type ActionType =
  'upload';

export function useAction(action: 'upload', props: { query: string }): Function;
export function useAction(action: ActionType, props: any): Function {
  switch (action) {
    case 'upload':
      const { upload } = useUpload(gql(props.query));
      return () => getFile(upload);
    default:
      throw new Error(`Unknown action '${action}'`);
  }
}

export function useActions(buttons: EAdminPageHeader['buttons']) {
  return (buttons ?? []).map(b => useAction(b.action, b as any));
}
