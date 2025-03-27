'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/home': [{ title: 'Home', link: '/home' }],
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
    { title: 'Dashboard', link: '/home' },
    { title: 'Category', link: '/home/category' },
    { title: 'Update', link: '/home/category/update' },
  ],
  '/setting/product/update': [
    { title: 'Setting', link: '/setting' },
    { title: 'Product', link: '/setting/product' },
    { title: 'Update', link: '/setting/product/update' },
  ],
  '/setting/product/create': [
    { title: 'Setting', link: '/setting' },
    { title: 'Product', link: '/setting/product' },
    { title: 'Create', link: '/setting/product/create' },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = useMemo(() => {
    // Check for exact path mappings first
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const items: BreadcrumbItem[] = [];
    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;
      let title = segment.charAt(0).toUpperCase() + segment.slice(1);

      if (segment === 'create') {
        title = 'Create';
      } else if (segment === 'update') {
        title = 'Update';
        items.push({ title, link: currentPath });
        // Skip the next segment if it looks like a UUID
        if (
          i + 1 < segments.length &&
          segments[i + 1].match(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          )
        ) {
          i++; // Skip the ID segment
        }
        continue; // Move to the next iteration
      }

      items.push({
        title,
        link: currentPath,
      });
    }

    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return breadcrumbs;
}
