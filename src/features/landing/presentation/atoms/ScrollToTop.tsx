'use client';

import { Button } from '@/components/ui/button';
import { ScrollType, useAppScroll } from '@/shared/hooks/useAppScroll';
import { ArrowUpToLine } from 'lucide-react';
import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 400;

const ScrollToTop = () => {
  const { scroll, getElement, getScrollPosition } = useAppScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = getElement();
    if (!container) return;

    const handleScroll = () => {
      setIsVisible(getScrollPosition() > SCROLL_THRESHOLD);
    };

    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [getElement, getScrollPosition]);

  const handleClick = () => {
    scroll({ type: ScrollType.ToTop, scrollBehavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-4 right-4 rounded-full p-3 shadow-md opacity-90 z-50"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUpToLine className="h-4 w-4" />
    </Button>
  );
};

export default ScrollToTop;
