import './entity-grid.scss';

import { gql, useQuery } from '@apollo/react-hooks';
import classnames from 'classnames';
import React, { useMemo, CSSProperties } from 'react';

import { Card } from '../Card/Card';
import { Grid } from '../Grid/Grid';
import { Loader } from '../Loader/Loader';
import { formatIfDate } from '../../lib/format';

export interface EntityGridProps {
  itemMap: {
    image: string;
    title: string;
    subTitle: string;
  };
  query: string;
  queryKey: string;
  style?: CSSProperties;
}

export const EntityGrid: React.FunctionComponent<EntityGridProps> = ({
  query,
  queryKey,
  itemMap,
  style,
}) => {
  const { data, loading } = useQuery<{ [queryKey: string]: any[] }>(gql(query));

  const items = useMemo<EntityGridProps['itemMap'][]>(() => {
    if (!data) return [];
    return data[queryKey].map(i => ({
      image: i[itemMap.image],
      title: i[itemMap.title],
      subTitle: i[itemMap.subTitle]
    }));
  }, [data]);

  if (loading) return <Loader />;

  return <Grid className={classnames('entity-grid')} style={style}>
    {items.map((i, j) => <Card key={j} className={classnames('item')}>
      <div className="img">
        <img src={i.image} alt={i.title} />
      </div>
      <h5>{i.title}</h5>
      <small>{formatIfDate(i.subTitle)}</small>
    </Card>)}
  </Grid>;
};
