import React from 'react';

import { Item } from '../../../types';
import {
  CommonTreeProps,
  INITIAL_BLOCK_HEIGHT,
  SCREENS_TO_RENDER,
} from '../../CustomTree';
import { useObservable } from '../../hooks/useObservable';
import { getMaxItemsVisibleOnScreen } from '../../utils/getMaxItemsVisibleOnScreen';
import { Expandable } from '../Expandable';
import { ListItem } from '../ListItem';

import styles from '../../CustomTree.module.css';

interface Props extends CommonTreeProps {
  height: number;
}

export const ObservableTree: React.FC<Props> = ({
  className,
  height,
  items,
  onToggle,
}) => {
  const [expandedStatus, setExpandedStatus] = React.useState<
    Record<Item['id'], boolean>
  >({});

  const itemsOnScreen = getMaxItemsVisibleOnScreen({
    containerHeight: height,
    itemHeight: INITIAL_BLOCK_HEIGHT,
  });

  const indexOfObservable = React.useRef<{
    top: number | null;
    bottom: number | null;
  }>({
    top: null,
    bottom: itemsOnScreen * (SCREENS_TO_RENDER - 1),
  });

  const idOfObservable = React.useRef<{
    top: string | null;
    bottom: string | null;
  }>({
    top: null,
    bottom: indexOfObservable.current.bottom
      ? items[indexOfObservable.current.bottom].id
      : null,
  });

  const observerRefTop = React.useRef<IntersectionObserver | null>(null);
  const observerRefBottom = React.useRef<IntersectionObserver | null>(null);
  const observableElement = React.useRef<{
    top: HTMLElement | null;
    bottom: HTMLElement | null;
  }>({
    top: null,
    bottom: null,
  });

  const itemsAmountToRender = itemsOnScreen * SCREENS_TO_RENDER;

  const [itemsToRender, setItemsToRender] = React.useState(
    items.slice(0, itemsAmountToRender)
  );

  useObservable({
    items,
    observerRefTop,
    observerRefBottom,
    indexOfObservable,
    idOfObservable,
    observableElement,
    itemsOnScreen,
    itemsAmountToRender,
    setItemsToRender,
    screensToRender: SCREENS_TO_RENDER,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const id: Item['id'] = event.currentTarget.id;

    const isExpandedUpdated =
      id in expandedStatus ? !expandedStatus[id] : false;

    setExpandedStatus({
      ...expandedStatus,
      [id]: isExpandedUpdated,
    });

    onToggle && onToggle({ id, isExpanded: isExpandedUpdated });
  };

  const observableNodeSetter = (node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    const id = node.dataset.id;

    if (id === idOfObservable.current.bottom) {
      if (observableElement.current.bottom) {
        observerRefBottom.current?.unobserve(observableElement.current.bottom);
      }
      observerRefBottom.current?.observe(node);
      observableElement.current.bottom = node;
    }

    if (id === idOfObservable.current.top) {
      if (observableElement.current.top) {
        observerRefTop.current?.unobserve(observableElement.current.top);
      }
      observerRefTop.current?.observe(node);

      observableElement.current.top = node;
    }
  };

  const renderTreeContent = ({
    items,
    branchId,
  }: {
    items: Item[];
    branchId?: Item['id'];
  }) => {
    return items.map(({ id, label, children }) => {
      if (children.length) {
        return (
          <div ref={observableNodeSetter} key={id} data-id={id}>
            <Expandable
              id={id}
              isExpanded={id in expandedStatus ? expandedStatus[id] : true}
              label={label}
              onClick={handleClick}
            >
              {renderTreeContent({ items: children, branchId: id })}
            </Expandable>
          </div>
        );
      } else {
        return (
          <div
            ref={observableNodeSetter}
            key={id}
            data-id={id}
            aria-labelledby={branchId}
          >
            <ListItem id={id} label={label} />
          </div>
        );
      }
    });
  };

  return (
    <div
      className={`${styles.main} ${className ?? ''}`}
      style={
        {
          '--blockHeight': `${INITIAL_BLOCK_HEIGHT}px`,
          '--visibleAreaHeight': `${height}px`,
        } as React.CSSProperties
      }
    >
      {renderTreeContent({ items: itemsToRender })}
    </div>
  );
};
