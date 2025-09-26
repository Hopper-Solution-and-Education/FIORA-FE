'use client';

import { useEffect } from 'react';

export function useElementScrollToBottom(
  ref: React.RefObject<HTMLElement | null>,
  onBottom: () => void,
  offset = 0, // pixels before bottom
) {
  useEffect(() => {
    if (!ref.current) return;

    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;

      const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + offset;

      if (isBottom) {
        onBottom();
      }
    };

    const el = ref.current;
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [ref, onBottom, offset]);
}
