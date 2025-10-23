import { BreadcrumbConfig, BreadcrumbItem, routeMapping } from '@/config/breadcrumb';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { buildBreadcrumbItems, replacePlaceholdersInLink } from '../utils/breadcrum';

/**
 * Configuration for breadcrumb behavior, defining exclusions, custom titles, and placeholder mappings.
 */
export const baseBreadcrumbConfig = {
  // Segments to exclude from breadcrumbs (e.g., 'setting' is skipped)
  excludeSegments: ['setting'],

  // Custom titles for specific URL segments
  customTitles: {
    create: 'Create',
    update: 'Update',
    details: 'Details',
    summary: 'Summary',
  },

  // Segments after which UUIDs or numeric segments should be skipped
  skipUuidAfter: ['update', 'details', 'summary', 'detail'],

  // Mappings for replacing placeholders (e.g., [year], [id]) in breadcrumb links
  placeholderMappings: {
    // Resolves [year] placeholder, prioritizing query param 'year', then last numeric segment
    year: (segments: string[], searchParams: ReadonlyURLSearchParams | null): string | null => {
      const yearFromQuery = searchParams?.get('year');
      if (yearFromQuery && /^\d{4}$/.test(yearFromQuery)) return yearFromQuery;

      const lastSegment = segments[segments.length - 1];
      return /^\d{4}$/.test(lastSegment) ? lastSegment : new Date().getFullYear().toString();
    },

    // Resolves [id] placeholder, prioritizing query param 'id', then last numeric segment
    id: (segments: string[], searchParams: ReadonlyURLSearchParams | null): string | null => {
      const idFromQuery = searchParams?.get('id');
      if (idFromQuery) return idFromQuery;

      const lastSegment = segments[segments.length - 1];
      return /^\d+$/.test(lastSegment) ? lastSegment : null;
    },
  },
};

/**
 * React hook to generate breadcrumbs based on the current pathname.
 * @param customConfig - Optional custom configuration to override defaults.
 * @returns Array of breadcrumb items for the current path.
 */
export function useBreadcrumbs(customConfig: Partial<BreadcrumbConfig> = {}): BreadcrumbItem[] {
  const pathname = (usePathname() || '').replace(/\/+$/, ''); // bỏ trailing slash
  const searchParams = useSearchParams(); // trong Client luôn có, không cần new ReadonlyURLSearchParams
  const segments = pathname.split('/').filter(Boolean);

  const config: BreadcrumbConfig = { ...baseBreadcrumbConfig, ...customConfig };

  return useMemo(() => {
    // 1) Khớp tĩnh
    if (routeMapping[pathname]) {
      return routeMapping[pathname].map((item) => ({
        ...item,
        link: replacePlaceholdersInLink(item.link, segments, searchParams, config),
      }));
    }

    // 2) Khớp động
    const dynamicRoute = Object.keys(routeMapping).find((route) => {
      const routeSegments = route.replace(/\/+$/, '').split('/').filter(Boolean);
      if (routeSegments.length !== segments.length) return false;
      return routeSegments.every((routeSeg, i) =>
        routeSeg.startsWith('[') && routeSeg.endsWith(']') ? true : routeSeg === segments[i],
      );
    });

    if (dynamicRoute) {
      return routeMapping[dynamicRoute].map((item) => ({
        ...item,
        link: replacePlaceholdersInLink(item.link, segments, searchParams, config),
      }));
    }

    // 3) Build động
    const items = buildBreadcrumbItems(segments, config);
    if (items.length > 0 && items[0].title !== 'Home') {
      items.unshift({ title: 'Home', link: '/' });
    }
    return items;
  }, [pathname, searchParams, config]);
}
