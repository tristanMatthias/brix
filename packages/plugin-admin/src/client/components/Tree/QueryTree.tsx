import { gql, useQuery } from '@apollo/react-hooks';
import React, { useMemo } from 'react';
import { TreeItem } from 'react-sortable-tree';

import { Loader } from '../Loader/Loader';
import { Tree, TreeProps } from './Tree';

export interface QueryTreeProps extends Omit<TreeProps, 'value'> {
  query: string;
  queryKey: string;
  map: { value: string; title: string, subtitle?: string; };
}

export const QueryTree: React.FunctionComponent<QueryTreeProps> = ({
  query,
  queryKey,
  map,
  ...TreeProps
}) => {
  const { data, loading, error } = useQuery(gql(query));

  const items = useMemo(() => {
    if (!data) return [];
    return (data[queryKey] as any[]).map<TreeItem>(i => ({
      title: i[map.title],
      subtitle: map.subtitle ? i[map.subtitle] : null
    }));
  }, [data]);

  if (loading) return <Loader />;

  // TODO: Add error comp
  if (error) return <span>There was an error</span>;

  return <Tree value={items} {...TreeProps} />;
};
