import React from 'react';

import { RenderItemFn } from '../../../types';

import styles from './Expandable.module.css';

interface Props {
  children: React.ReactNode;
  id: string;
  isExpanded: boolean;
  label: string;
  renderTitle?: RenderItemFn;
  onClick(event: React.MouseEvent<HTMLElement>): void;
}

export const Expandable: React.FC<Props> = ({
  children,
  id,
  isExpanded,
  label,
  renderTitle,
  onClick,
}) => (
  <div className={`${styles.main} ${isExpanded ? styles.isExpanded : ''}`}>
    <button
      id={id}
      className={`${styles.label} ${isExpanded ? styles.isExpanded : ''}`}
      onClick={onClick}
      aria-label={label}
    >
      {renderTitle ? renderTitle({ id, label }) : label}
    </button>
    {isExpanded && <div className={styles.content}>{children}</div>}
  </div>
);
