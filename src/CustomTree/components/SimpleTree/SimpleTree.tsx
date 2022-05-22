import React from 'react';

import { Item } from '../../../types';
import { CommonTreeProps } from '../../CustomTree';
import { ListItem } from '../ListItem';
import { Expandable } from '../Expandable';

import styles from '../../CustomTree.module.css';

export const SimpleTree: React.FC<CommonTreeProps> = ({
  className,
  items,
  renderBranch,
  renderListItem,
  onToggle,
}) => {
  const [expandedStatus, setExpandedStatus] = React.useState<
    Record<Item['id'], boolean>
  >({});

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const id = event.currentTarget.id;

      const isExpandedUpdated =
        id in expandedStatus ? !expandedStatus[id] : false;

      setExpandedStatus({
        ...expandedStatus,
        [id]: isExpandedUpdated,
      });

      onToggle && onToggle({ id, isExpanded: isExpandedUpdated });
    },
    [expandedStatus, onToggle]
  );

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
          <div key={id}>
            <Expandable
              id={id}
              isExpanded={id in expandedStatus ? expandedStatus[id] : true}
              label={label}
              renderTitle={renderBranch}
              onClick={handleClick}
            >
              {renderTreeContent({ items: children, branchId: id })}
            </Expandable>
          </div>
        );
      } else {
        const listItem = renderListItem ? (
          renderListItem({ id, label })
        ) : (
          <ListItem id={id} label={label} />
        );

        return (
          <div key={id} aria-labelledby={branchId}>
            {listItem}
          </div>
        );
      }
    });
  };

  return (
    <div className={`${styles.main} ${className ?? ''}`}>
      {renderTreeContent({ items })}
    </div>
  );
};
