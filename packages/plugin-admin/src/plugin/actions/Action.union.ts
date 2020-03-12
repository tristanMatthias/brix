import { createUnionType } from 'type-graphql';
import { ActionLink } from './Link.action';
import { ActionUpload } from './Upload.action';
import { ActionPick, ActionSelect } from './Pick.action';


export type Action = ActionLink | ActionUpload | ActionPick | ActionSelect;


export const ActionUnion = createUnionType({
  name: 'Action',
  types: [
    ActionLink,
    ActionUpload,
    ActionPick,
    ActionSelect
  ],
  resolveType: value => {
    switch (value.action) {
      case 'link': return ActionLink;
      case 'upload': return ActionUpload;
      case 'pick': return ActionPick;
      case 'select': return ActionSelect;
    }
  }
});
