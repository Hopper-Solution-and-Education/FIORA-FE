'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/home': [{ title: 'Dashboard', link: '/home' }],
  '/home/employee': [
    { title: 'Dashboard', link: '/home' },
    { title: 'Employee', link: '/home/employee' },
  ],
  '/home/product': [
    { title: 'Dashboard', link: '/home' },
    { title: 'Product', link: '/home/product' },
  ],
  '/home/category': [
    { title: 'Dashboard', link: '/home' },
    { title: 'Category', link: '/home/category' },
  ],
  '/home/category/create': [
    { title: 'Dashboard', link: '/home' },
    { title: 'Category', link: '/home/category' },
    { title: 'Create', link: '/home/category/create' },
  ],
  '/home/category/update': [
    // Simplified key without [id]
    { title: 'Dashboard', link: '/home' },
    { title: 'Category', link: '/home/category' },
    { title: 'Update', link: '/home/category/update' },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = useMemo(() => {
    // Check for an update route pattern and use the custom mapping
    if (pathname.startsWith('/home/category/update/')) {
      return routeMapping['/home/category/update'];
    }

    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Generate breadcrumbs dynamically from path segments
    const items: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      let title = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Skip numeric IDs following 'update'
      if (
        index > 0 &&
        segments[index - 1] === 'update' &&
        segment.match(/^\d+$/) // Assuming IDs are numeric
      ) {
        return; // Skip adding this segment to breadcrumbs
      }

      // Customize titles for specific segments
      if (segment === 'create') {
        title = 'Create';
      } else if (segment === 'update') {
        title = 'Update';
      }

      items.push({
        title,
        link: currentPath,
      });
    });

    return items;
  }, [pathname]);

  return breadcrumbs;
}
