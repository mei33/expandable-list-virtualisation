import React from 'react';

export interface Item {
  id: string;
  label: string;
  children: Item[];
}

export type RenderItemFn = ({
  id,
  label,
}: {
  id: Item['id'];
  label: Item['label'];
}) => React.ReactNode;
