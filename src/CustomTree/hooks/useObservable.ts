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
  const itemsBeforeTopObservable = itemsOnScreen * 2;

  // движение вниз
  React.useLayoutEffect(() => {
    observerRefBottom.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!indexOfObservable.current.bottom) {
              return;
            }

            const indexOfObservableBottomUpdated =
              indexOfObservable.current.bottom + itemsOnScreen;

            if (indexOfObservableBottomUpdated > items.length) {
              if (observableElement.current.bottom) {
                observerRefTop.current?.unobserve(
                  observableElement.current.bottom
                );
              }
              return;
            }

            const idOfObservableBottomUpdated =
              items[indexOfObservableBottomUpdated].id;

            const indexOfObservableTopUpdated =
              indexOfObservable.current.bottom - itemsOnScreen;

            if (
              indexOfObservableTopUpdated &&
              indexOfObservableTopUpdated > itemsBeforeTopObservable
            ) {
              idOfObservable.current.top =
                items[indexOfObservableTopUpdated].id;
              indexOfObservable.current.top = indexOfObservableTopUpdated;
            }

            idOfObservable.current.bottom = idOfObservableBottomUpdated;
            indexOfObservable.current.bottom = indexOfObservableBottomUpdated;

            const startIndexToRender =
              indexOfObservable.current.top &&
              indexOfObservable.current.top >= itemsBeforeTopObservable
                ? indexOfObservable.current.top - itemsBeforeTopObservable
                : 0;

            setItemsToRender(
              items.slice(
                startIndexToRender,
                startIndexToRender + itemsAmountToRender + itemsOnScreen
              )
            );
          }
        });
      },
      { threshold: 1.0 }
    );

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
    observerRefTop.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!indexOfObservable.current.top) {
              return;
            }

            const indexOfObservableTopUpdated =
              indexOfObservable.current.top - itemsOnScreen - 1;

            const idOfObservableTopUpdated =
              indexOfObservableTopUpdated > itemsOnScreen
                ? items[indexOfObservableTopUpdated].id
                : null;

            const indexOfObservableBottomUpdated =
              indexOfObservable.current.top + itemsOnScreen;

            idOfObservable.current.bottom =
              items[indexOfObservableBottomUpdated].id;
            indexOfObservable.current.bottom = indexOfObservableBottomUpdated;

            idOfObservable.current.top = idOfObservableTopUpdated;
            indexOfObservable.current.top =
              indexOfObservableTopUpdated > itemsOnScreen
                ? indexOfObservableTopUpdated
                : null;

            if (
              !indexOfObservable.current.top &&
              observableElement.current.top
            ) {
              observerRefTop.current?.unobserve(observableElement.current.top);
            }

            const startIndexToRender =
              indexOfObservableTopUpdated >= itemsOnScreen
                ? indexOfObservableTopUpdated - itemsOnScreen
                : 0;

            setItemsToRender(
              items.slice(
                startIndexToRender,
                startIndexToRender + itemsAmountToRender
              )
            );
          }
        });
      },
      { threshold: 1.0 }
    );

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
