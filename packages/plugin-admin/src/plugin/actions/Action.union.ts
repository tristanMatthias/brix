import { createUnionType } from 'type-graphql';
import { ActionLink } from './Link.action';
import { ActionUpload } from './Upload.action';

export type ActionType = 'entityGrid' | 'table';


export type Action = ActionLink | ActionUpload;


export const ActionUnion = createUnionType({
  name: 'Action',
  types: [
    ActionLink,
    ActionUpload
  ],
  resolveType: value => {
    switch (value.action) {
      case 'link': return ActionLink;
      case 'upload': return ActionUpload;
    }
  }
});
