export const getMaxItemsVisibleOnScreen = ({
  containerHeight,
  itemHeight,
}: {
  containerHeight: number;
  itemHeight: number;
}) => Math.floor(containerHeight / itemHeight) + 1;
