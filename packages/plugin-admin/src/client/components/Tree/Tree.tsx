import './tree.scss';

import deepEqual from 'deep-equal';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SortableTree, { GetNodeKeyFunction, removeNodeAtPath, TreeItem } from 'react-sortable-tree';

import { removeKeys } from '../../lib/removeKeys';
import { Icon } from '../Icon/Icon';


type WithoutExpanded = Omit<TreeItem, 'expanded'>[];

export interface TreeProps {
  value?: any[];
  onChange?: (data: WithoutExpanded) => void;
  map?: {
    value: string,
    title: string,
    subtitle?: string,
    children?: string;
  };
}

export const Tree: React.FunctionComponent<TreeProps> = DragDropContext(HTML5Backend)(({
  value = [],
  map,
  onChange
}) => {
  const getNodeKey: GetNodeKeyFunction = ({ treeIndex }) => treeIndex;

  const [data, setData] = useState<TreeItem[]>([]);
  const [cache, setCache] = useState<any[]>();

  const valueToTreeItem = (v: any): TreeItem => {
    if (!map) return v;
    return {
      value: v[map.value],
      title: v[map.title],
      subtitle: v[map.subtitle || 'subtitle'],
      children: v[map.children || 'children']?.map(valueToTreeItem)
    };
  };

  const treeItemToValue = (i: TreeItem): any => {
    if (!map) return i;
    return {
      [map.value]: i.value,
      [map.title]: i.title,
      [map.subtitle || 'subtitle']: i.subtitle,
      [map.children || 'children']: (i.children as TreeItem[] || []).map(treeItemToValue)
    };
  };

  useEffect(() => {
    if (!data.length || !deepEqual(cache, value)) {
      setData(value.map(valueToTreeItem));
    }
  }, [value]);


  const update = (items: TreeItem[]) => {
    const mapped = removeKeys(items.map(treeItemToValue), ['expanded']) as Omit<TreeItem, 'expanded'>[];
    if (!deepEqual(mapped, cache)) {
      setCache(mapped);
      onChange?.(mapped);
    }
    setData(items);
  };


  return <SortableTree
    treeData={data}
    onChange={update}
    rowHeight={40}
    scaffoldBlockPxWidth={30}
    generateNodeProps={({ path }) => ({
      buttons: [
        <Icon icon="trash" color="error" onClick={() =>
          update(removeNodeAtPath({
            treeData: data,
            path,
            getNodeKey
          }))
        } />
      ]
    })}
  />;
});
