import React from 'react';

import { Item, RenderItemFn } from '../types';
import { getSortedItems } from '../utils/getSortedItems';

import { Expandable } from './components/Expandable';
import { ListItem } from './components/ListItem';

import styles from './NativeTree.module.css';

interface Props {
  className?: string;
  items: Item[];
  isSorted?: boolean;
  renderBranch?: RenderItemFn;
  renderListItem?: RenderItemFn;
  onToggle?(id: Item['id']): void;
}

export const NativeTree: React.FC<Props> = ({
  className,
  items,
  isSorted = true,
  renderBranch,
  renderListItem,
  onToggle,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const id: Item['id'] = event.currentTarget.id;

    onToggle && onToggle(id);
  };

  if (!items.length) {
    return null;
  }

  const renderTreeContent = ({
    items,
    branchLabel,
    branchId,
  }: {
    items: Item[];
    branchLabel?: Item['label'];
    branchId?: Item['id'];
  }) => (
    <ul className={styles.list} id={branchId} aria-label={branchLabel}>
      {items.map(({ id, label, children }) => {
        let listItem;

        if (children.length) {
          const nestedItems = isSorted ? getSortedItems(children) : children;

          listItem = (
            <Expandable
              id={id}
              label={label}
              onClick={handleClick}
              renderTitle={renderBranch}
            >
              {renderTreeContent({
                items: nestedItems,
                branchLabel,
                branchId: id,
              })}
            </Expandable>
          );
        } else {
          listItem = renderListItem ? (
            renderListItem({ id, label })
          ) : (
            <ListItem id={id} label={label} />
          );
        }

        return (
          <li key={id} aria-labelledby={branchId}>
            {listItem}
          </li>
        );
      })}
    </ul>
  );

  return <div className={className}>{renderTreeContent({ items })}</div>;
};
