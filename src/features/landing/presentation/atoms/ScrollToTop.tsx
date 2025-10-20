'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpToLine } from 'lucide-react';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById('app-content');
    if (!container) return;

    const toggleVisibility = () => {
      if (container.scrollTop > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Gọi 1 lần khi mount
    toggleVisibility();

    container.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => container.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById('app-content');
    if (!container) return;
    container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 rounded-full p-3 shadow-md opacity-90 z-50"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUpToLine className="h-4 w-4" />
    </Button>
  );
};

export default ScrollToTop;
