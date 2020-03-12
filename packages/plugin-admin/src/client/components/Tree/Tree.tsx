import './react-tree.scss';
import './tree.scss';

import deepEqual from 'deep-equal';
import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import SortableTree, {
  changeNodeAtPath,
  GetNodeKeyFunction,
  insertNode,
  removeNodeAtPath,
  TreeItem,
} from 'react-sortable-tree';

import { removeKeys } from '../../lib/removeKeys';
import { Widget as WidgetType } from '../../lib/widgets';
import { Box } from '../Box/Box';
import { ButtonProps } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { TextField } from '../TextField/TextField';
import { Widget } from '../Widget/Widget';
import { EditableText } from '../EditableText/EditableText';


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
  createMap?: {
    value: string,
    title: string,
    subtitle?: string,
    children?: string;
  };
  createButton?: ButtonProps;
}

export const Tree: React.FunctionComponent<TreeProps> = DragDropContext(HTML5Backend)(({
  value = [],
  map,
  createMap,
  createButton,
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

  const pickedToTreeItem = (v: any): TreeItem => {
    if (!createMap) return v;
    return {
      value: v[createMap.value],
      title: v[createMap.title],
      subtitle: v[createMap.subtitle || 'subtitle'],
      children: v[createMap.children || 'children']?.map(valueToTreeItem)
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


  return <Box className="tree">
    {createButton && <Widget
      widget={{ ...createButton, widget: 'button' } as WidgetType}
      data={(value: any) => {
        update(insertNode({
          treeData: data,
          newNode: pickedToTreeItem(value),
          depth: 0,
          getNodeKey,
          minimumTreeIndex: 0
        }).treeData);
      }}
    />}
    <SortableTree
      treeData={data}
      onChange={update}
      rowHeight={40}
      scaffoldBlockPxWidth={30}
      generateNodeProps={({ node, path }) => ({
        title: (
          <EditableText
            value={node.title as string}
            onChange={event => {
              const title = (event.target as HTMLInputElement).value;
              update(changeNodeAtPath({
                treeData: data,
                path,
                getNodeKey,
                newNode: { ...node, title }
              })
              );
            }}
          />
        ),
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
    />
  </Box>;
});
