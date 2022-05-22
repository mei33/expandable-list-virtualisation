import React from 'react';

import { Item } from '../../types';

interface Params {
  items: Item[];
  observerRefTop: React.MutableRefObject<IntersectionObserver | null>;
  observerRefBottom: React.MutableRefObject<IntersectionObserver | null>;
  indexOfObservable: React.MutableRefObject<{
    top: number | null;
    bottom: number | null;
  }>;
  idOfObservable: React.MutableRefObject<{
    top: string | null;
    bottom: string | null;
  }>;
  observableElement: React.MutableRefObject<{
    top: HTMLElement | null;
    bottom: HTMLElement | null;
  }>;
  itemsOnScreen: number;
  screensToRender: number;
  itemsAmountToRender: number;
  setItemsToRender: React.Dispatch<React.SetStateAction<Item[]>>;
}

export const useObservable = ({
  items,
  observerRefTop,
  observerRefBottom,
  indexOfObservable,
  idOfObservable,
  observableElement,
  itemsOnScreen,
  screensToRender,
  itemsAmountToRender,
  setItemsToRender,
}: Params) => {
  // движение вниз
  React.useLayoutEffect(() => {
    observerRefBottom.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!indexOfObservable.current.bottom) {
            return;
          }

          const indexOfObservableBottomUpdated =
            indexOfObservable.current.bottom + itemsOnScreen;

          if (indexOfObservableBottomUpdated > items.length) {
            return;
          }

          const idOfObservableBottomUpdated =
            items[indexOfObservableBottomUpdated].id;

          const indexOfObservableTopUpdated =
            indexOfObservable.current.bottom - itemsOnScreen;

          idOfObservable.current.top = items[indexOfObservableTopUpdated].id;
          idOfObservable.current.bottom = idOfObservableBottomUpdated;

          const startIndexToRender =
            indexOfObservable.current.bottom - itemsOnScreen;

          setItemsToRender(
            items.slice(
              startIndexToRender,
              startIndexToRender + itemsAmountToRender
            )
          );

          indexOfObservable.current.top = indexOfObservableTopUpdated;
          indexOfObservable.current.bottom = indexOfObservableBottomUpdated;
        }
      });
    });

    if (!observableElement.current.bottom) {
      return;
    }

    observerRefBottom.current.observe(observableElement.current.bottom);

    return () => {
      observerRefBottom.current?.disconnect();
    };
  }, [
    idOfObservable,
    indexOfObservable,
    items,
    itemsAmountToRender,
    itemsOnScreen,
    observableElement,
    observerRefBottom,
    screensToRender,
    setItemsToRender,
  ]);

  // движение вверх
  React.useLayoutEffect(() => {
    observerRefTop.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!indexOfObservable.current.top) {
            return;
          }

          const indexOfObservableTopUpdated =
            indexOfObservable.current.top - itemsOnScreen;

          const idOfObservableTopUpdated =
            indexOfObservableTopUpdated > 0
              ? items[indexOfObservableTopUpdated].id
              : null;

          const indexOfObservableBottomUpdated =
            indexOfObservable.current.top + itemsOnScreen;

          idOfObservable.current.bottom =
            items[indexOfObservableBottomUpdated].id;
          idOfObservable.current.top = idOfObservableTopUpdated;

          const endIndexToRender =
            indexOfObservable.current.top +
            itemsOnScreen * (screensToRender - 1);

          setItemsToRender(
            items.slice(
              endIndexToRender - itemsAmountToRender,
              endIndexToRender
            )
          );

          indexOfObservable.current.bottom = indexOfObservableBottomUpdated;
          indexOfObservable.current.top =
            indexOfObservableTopUpdated > 0
              ? indexOfObservableTopUpdated
              : null;
        }
      });
    });

    if (!observableElement.current.top) {
      return;
    }

    observerRefTop.current.observe(observableElement.current.top);

    return () => {
      observerRefTop.current?.disconnect();
    };
  }, [
    idOfObservable,
    indexOfObservable,
    items,
    itemsAmountToRender,
    itemsOnScreen,
    observableElement,
    observerRefTop,
    screensToRender,
    setItemsToRender,
  ]);
};
