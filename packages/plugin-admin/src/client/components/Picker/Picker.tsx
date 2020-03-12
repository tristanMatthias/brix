import './picker.scss';
import React from 'react';
import { Picker as PC } from '../../containers/Picker.container';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EntityGrid } from '../EntityGrid/EntityGrid';


export const Picker = () => {
  const { close, picker, setValue, value } = PC.useContainer();
  if (!picker) return null;

  return <div className="picker">
    <Card>
      {picker.title && <h3>{picker.title}</h3>}
      <EntityGrid
        itemMap={picker.itemMap}
        query={picker.query}
        queryKey={picker.queryKey}
        onChange={setValue}
      />
      <footer>
        <Button onClick={() => close()} hollow={true}>Close</Button>
        <Button
          color="success"
          onClick={() => close(true)}
          disabled={!Boolean(value)}
        >Choose</Button>
      </footer>
    </Card>
  </div>;
};
