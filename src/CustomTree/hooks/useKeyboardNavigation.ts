import React from 'react';
import { Item } from '../../types';

interface Params {
  containerRef: React.MutableRefObject<HTMLElement | null>;
  onToggle: (id: Item['id'], isExpanded: boolean) => void;
}

export const useKeyboardNavigation = ({ containerRef, onToggle }: Params) => {
  React.useEffect(() => {
    const onKeydown = ({ key }: KeyboardEvent) => {
      if (!containerRef.current) {
        return;
      }

      const activeElement = document.activeElement;
      const isTabNaviationInited = containerRef.current.contains(activeElement);

      if (!isTabNaviationInited || !activeElement) {
        return;
      }

      switch (key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          onToggle(activeElement.id, key === 'ArrowRight');
          break;
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, [containerRef, onToggle]);
};
