'use client';

import { useEffect } from 'react';

export function useWindowScrollToTop(onTop: () => void, offset: number = 0) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= offset) {
        onTop();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onTop, offset]);
}

export function useWindowScrollToBottom(onBottom: () => void, offset = 0) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - offset) {
        onBottom();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onBottom, offset]);
}
