'use client';

type ScrollBehaviorType = 'auto' | 'smooth';
const DEFAULT_BEHAVIOR: ScrollBehaviorType = 'auto';
const DEFAULT_OFFSET = 100;

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
  const getElement = () => {
    return document.getElementById(APP_LAYOUT_ID) || document.documentElement;
  };

  const getScrollPosition = () => {
    const el = getElement();
    return el === document.documentElement ? window.scrollY : el.scrollTop;
  };

  const scroll = ({
    type,
    sectionId,
    offset = DEFAULT_OFFSET,
    position,
    delta,
    scrollBehavior = DEFAULT_BEHAVIOR,
  }: ScrollOptions) => {
    const el = getElement();
    if (!el) return;

    let top = el.scrollTop;

    switch (type) {
      case ScrollType.ToSection: {
        const target = sectionId ? document.getElementById(sectionId) : null;
        if (target) top = target.offsetTop - offset;
        break;
      }

      case ScrollType.ToTop:
        top = 0;
        break;

      case ScrollType.ToPosition:
        if (typeof position === 'number') top = position;
        break;

      case ScrollType.ByDelta:
        if (typeof delta === 'number') top = el.scrollTop + delta;
        break;
    }

    if (el === document.documentElement) {
      window.scrollTo({ top, behavior: scrollBehavior });
    } else {
      el.scrollTo({ top, behavior: scrollBehavior });
    }
  };

  return {
    scroll,
    getScrollPosition,
    getElement,
  };
};
