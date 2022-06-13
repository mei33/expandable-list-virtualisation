import React from 'react';

import { Item, RenderItemFn } from '../types';

import { SimpleTree } from './components/SimpleTree/SimpleTree';
import { ObservableTree } from './components/ObservableTree/ObservableTree';
import { getMaxItemsVisibleOnScreen } from './utils/getMaxItemsVisibleOnScreen';

interface Props {
  className?: string;
  height?: number;
  items: Item[];
  isSorted?: boolean;
  mode?: 'full' | 'auto';
  renderBranch?: RenderItemFn;
  renderListItem?: RenderItemFn;
  onToggle?({ id, isExpanded }: { id: Item['id']; isExpanded: boolean }): void;
}

export interface CommonTreeProps {
  className?: Props['className'];
  height?: Props['height'];
  items: Props['items'];
  isSorted?: Props['isSorted'];
  renderBranch: Props['renderBranch'];
  renderListItem: Props['renderListItem'];
  onToggle?: Props['onToggle'];
}

export const SCREENS_TO_RENDER = 4;
export const INITIAL_BLOCK_HEIGHT = 20;

export const CustomTree: React.FC<Props> = ({
  className,
  height: heightPassed,
  items,
  isSorted = true,
  mode = 'auto',
  renderBranch,
  renderListItem,
  onToggle,
}) => {
  if (!items.length) {
    return null;
  }

  const height = heightPassed || window.innerHeight;
  const itemsOnScreen = getMaxItemsVisibleOnScreen({
    containerHeight: height,
    itemHeight: INITIAL_BLOCK_HEIGHT,
  });

  const commonProps: CommonTreeProps = {
    className,
    items,
    isSorted,
    renderBranch,
    renderListItem,
    onToggle,
  };

  const itemsAmountToRender = itemsOnScreen * SCREENS_TO_RENDER;

  if (mode === 'full' || items.length <= itemsAmountToRender) {
    return <SimpleTree {...commonProps} />;
  }

  return <ObservableTree {...commonProps} height={height} />;
};
