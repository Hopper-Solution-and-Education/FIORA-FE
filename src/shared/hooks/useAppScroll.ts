'use client';

import { useCallback, useRef } from 'react';

type ScrollBehaviorType = 'auto' | 'smooth';
const SCROLL_BEHAVIOR: ScrollBehaviorType = 'auto';
const SCROLL_OFFSET = 100;

export enum ScrollType {
  ToSection = 'ToSection',
  ToTop = 'ToTop',
  ToPosition = 'ToPosition',
  ByDelta = 'ByDelta',
}

interface ScrollOptions {
  type: ScrollType;
  sectionId?: string;
  offset?: number;
  position?: number;
  delta?: number;
  scrollBehavior?: ScrollBehaviorType;
}

const APP_LAYOUT_ID = 'app-content';

export const useAppScroll = () => {
  const nextElementRef = useRef<HTMLElement | null>(null);

  const getNextElement = useCallback(() => {
    if (!nextElementRef.current) {
      nextElementRef.current = document.getElementById(APP_LAYOUT_ID);
    }

    return nextElementRef.current;
  }, []);

  const getCurrentScrollPosition = useCallback(() => {
    const nextElement = getNextElement();
    return nextElement?.scrollTop || 0;
  }, [getNextElement]);

  const scroll = useCallback(
    ({
      type,
      sectionId,
      offset = SCROLL_OFFSET,
      position,
      delta,
      scrollBehavior = SCROLL_BEHAVIOR,
    }: ScrollOptions) => {
      const nextElement = getNextElement();

      if (!nextElement) return;

      let top = nextElement.scrollTop;

      switch (type) {
        case ScrollType.ToSection:
          if (sectionId) {
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
              top = targetSection.offsetTop - offset;
            }
          }
          break;

        case ScrollType.ToTop:
          top = 0;
          break;

        case ScrollType.ToPosition:
          if (typeof position === 'number') {
            top = position;
          }
          break;

        case ScrollType.ByDelta:
          if (typeof delta === 'number') {
            top = nextElement.scrollTop + delta;
          }
          break;

        default:
          return;
      }

      nextElement.scrollTo({
        top,
        behavior: scrollBehavior,
      });
    },
    [getNextElement],
  );

  return { scroll, getCurrentScrollPosition };
};
