import './entity-grid.scss';

import { gql, useQuery } from '@apollo/react-hooks';
import classnames from 'classnames';
import React, { useMemo, CSSProperties, DOMAttributes, useState } from 'react';

import { Card } from '../Card/Card';
import { Grid } from '../Grid/Grid';
import { Loader } from '../Loader/Loader';
import { formatIfDate } from '../../lib/format';
import { useAction, Action } from '../../hooks/useAction';

export interface EntityGridProps {
  itemMap: {
    image?: string;
    title: string;
    subTitle: string;
  };
  query: string;
  queryKey: string;
  style?: CSSProperties;
  action?: Action;
  onChange?: (v: any) => void;
}

export const EntityGrid: React.FunctionComponent<EntityGridProps> = ({
  query,
  queryKey,
  itemMap,
  style,
  action,
  onChange
}) => {
  const { data, loading } = useQuery<{ [queryKey: string]: any[] }>(gql(query));
  const [value, setValue] = useState<any>();

  const items = useMemo<EntityGridProps['itemMap'][]>(() => {
    if (!data) return [];
    return data[queryKey].map(i => ({
      image: itemMap.image ? i[itemMap.image] : null,
      title: i[itemMap.title],
      subTitle: i[itemMap.subTitle]
    }));
  }, [data]);

  const actions = useMemo(() => {
    if (!items || !action) return null;
    return items.map(i => useAction(action, i) as DOMAttributes<any>['onClick']);
  }, [items]);

  const select = (item: any, i: any) => {
    if (item === value) {
      onChange?.(null);
      setValue(null);
    } else {
      onChange?.(data![queryKey][i]);
      setValue(item);
    }
  };

  if (loading) return <Loader />;

  return <Grid className={classnames('entity-grid')} style={style}>
    {items.map((i, j) => <Card
      key={j}
      className={classnames('item', { active: i === value })}
      onClick={e => {
        actions?.[j]?.(e);
        select(i, j);
      }}
    >
      {i.image && <div className="img">
        <img src={i.image} alt={i.title} />
      </div>}
      <h5>{i.title}</h5>
      {i.subTitle && <small>{formatIfDate(i.subTitle)}</small>}
    </Card>)}
  </Grid>;
};
