import React from 'react';

import { RenderItemFn } from '../../../types';

import styles from './Expandable.module.css';

interface Props {
  children: React.ReactNode;
  id: string;
  label: string;
  renderTitle?: RenderItemFn;
  onClick?(event: React.MouseEvent<HTMLElement>): void;
}

export const Expandable: React.FC<Props> = ({
  children,
  id,
  label,
  renderTitle,
  onClick,
}) => (
  <details className={styles.main}>
    <summary className={styles.label} onClick={onClick} id={id}>
      {renderTitle ? renderTitle({ id, label }) : label}
    </summary>
    <div className={styles.content}>{children}</div>
  </details>
);
