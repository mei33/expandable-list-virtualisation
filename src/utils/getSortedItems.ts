import { Item } from '../types';

export const getSortedItems = (items: Item[]) =>
  items.sort((a, b) => b.children.length - a.children.length);
