'use client';

import { useAppScroll } from '@/shared/hooks/useAppScroll';
import { useEffect } from 'react';

export const AutoScrollTopProvider = (): React.JSX.Element | null => {
  const { scroll } = useAppScroll();

  useEffect(() => {
    const scrollToTop = () => {
      document.getElementById('app-content')?.scrollTo(0, 0);
    };

    /**
     * Convert URL sang absolute path
     */
    const toAbsoluteURL = (url: string): string => {
      return new URL(url, window.location.href).href;
    };

    /**
     * Kiểm tra xem có phải anchor trong cùng trang hay không
     */
    const isSamePageAnchor = (currentUrl: string, newUrl: string): boolean => {
      const current = new URL(toAbsoluteURL(currentUrl));
      const next = new URL(toAbsoluteURL(newUrl));
      return current.href.split('#')[0] === next.href.split('#')[0];
    };

    /**
     * Kiểm tra cùng host
     */
    const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
      const current = new URL(toAbsoluteURL(currentUrl));
      const next = new URL(toAbsoluteURL(newUrl));
      return current.hostname.replace(/^www\./, '') === next.hostname.replace(/^www\./, '');
    };

    /**
     * Tìm thẻ <a> gần nhất
     */
    const findClosestAnchor = (el: HTMLElement | null): HTMLAnchorElement | null => {
      while (el && el.tagName.toLowerCase() !== 'a') {
        el = el.parentElement;
      }
      return el as HTMLAnchorElement | null;
    };

    /**
     * Xử lý click vào link
     */
    const handleClick = (event: MouseEvent): void => {
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const href = anchor?.href;
        if (!href) return;

        const currentUrl = window.location.href;

        // Không scroll cho external hoặc special scheme
        const isSpecialScheme = ['mailto:', 'tel:', 'sms:', 'blob:'].some((s) =>
          href.startsWith(s),
        );
        const notSameHost = !isSameHostName(currentUrl, href);

        if (isSpecialScheme || notSameHost) return;

        const sameAnchor = isSamePageAnchor(currentUrl, href);
        if (sameAnchor) return;

        // Nếu là cùng route (kể cả query khác), vẫn scroll
        requestAnimationFrame(scrollToTop);
      } catch (_) {
        requestAnimationFrame(scrollToTop);
      }
    };

    /**
     * Override pushState và replaceState để bắt navigation
     */
    const patchHistory = (method: 'pushState' | 'replaceState') => {
      const original = history[method];
      history[method] = (...args: [data: any, unused: string, url?: string | URL | null]) => {
        const result = original.apply(history, args);
        requestAnimationFrame(scrollToTop);
        return result;
      };
    };

    patchHistory('pushState');
    patchHistory('replaceState');

    const handlePopState = () => requestAnimationFrame(scrollToTop);
    const handlePageHide = () => scrollToTop();

    /**
     * Đăng ký listener
     */
    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [scroll]);

  return null;
};
