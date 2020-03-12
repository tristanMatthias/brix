import './picker-field.scss';

import { gql, useLazyQuery } from '@apollo/react-hooks';
import React, { useEffect, useMemo, useState } from 'react';

import { ActionPick, useAction } from '../../hooks/useAction';
import { dotObjString } from '../../lib/dotObjString';
import { Icon } from '../Icon/Icon';


export interface PickerFieldProps {
  pickAction: ActionPick;
  value?: string;
  onChange: (value?: string | null) => void;
  renderQuery: string;
  renderString: string;
}

export const PickerField: React.FunctionComponent<PickerFieldProps> = ({
  pickAction,
  value: initialValue,
  onChange,
  renderQuery,
  renderString
}) => {

  const [value, setValue] = useState<string | null>(initialValue || null);
  const open = useAction(pickAction, setValue);
  const [query, { data }] = useLazyQuery(gql(renderQuery));

  useEffect(() => {
    onChange?.(value);
    query({ variables: { [pickAction.pickKey || 'id']: value } });
  }, [value]);

  const render = useMemo(() => {
    if (!data) return '';
    const v = data[Object.keys(data).pop()!];
    return dotObjString(renderString, v);
  }, [data]);


  return <div onClick={() => open?.()} className="picker-field">
    {render || <span className="empty">Nothing selected</span>}
    {value && <Icon icon="x" onClick={() => setValue(null)} />}
  </div>;
};
