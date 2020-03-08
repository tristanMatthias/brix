import { useLazyQuery, gql } from '@apollo/react-hooks';
import React, { useEffect, useMemo, useState } from 'react';

import { dotObjString } from '../../lib/dotObjString';
import { Widget as WidgetType } from '../../lib/widgets';
import { Loader } from '../Loader/Loader';
import { Widget } from './Widget';
import dot from 'dot-object';
import equal from 'deep-equal';

export interface QueryWidgetsProps {
  query: string;
  resultKey: string;
  variables: object;
  data: object;
}

export const QueryWidgets: React.FunctionComponent<QueryWidgetsProps> = ({
  query,
  resultKey,
  variables,
  data
}) => {

  const [q, { data: qData, loading }] = useLazyQuery<{ [key: string]: WidgetType[] }>(gql(query));
  const [mapped, setMapped] = useState();

  useEffect(() => {
    if (!data && variables) return;
    const newMapped = !data ? null : Object.entries(variables).reduce((vars, [k, v]) => {
      vars[k] = dotObjString(v, data);
      return vars;
    }, {} as any);
    if (!equal(mapped, newMapped)) setMapped(newMapped);
    return;
  }, [variables, data]);

  useEffect(() => {
    if (variables && !mapped) return;
    q({ variables: mapped });
  }, [mapped]);

  const fields = useMemo<WidgetType[]>(() => {
    if (!qData) return [];
    return dot.pick(resultKey, qData);
  }, [qData]);


  if (!data) return null;
  if (loading) return <Loader />;

  return <>
    {fields?.map(f => <Widget widget={f} data={data} />)}
  </>;
};
