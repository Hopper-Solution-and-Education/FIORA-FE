/* eslint-disable react-hooks/exhaustive-deps */
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { breadcrumbConfig, BreadcrumbConfig } from '@/shared/configs/breadcrumbConfig';

/**
 * Represents a single breadcrumb item with a title and a link.
 */
export type BreadcrumbItem = {
  title: string;
  link: string;
};

/**
 * Static route mapping for predefined breadcrumb paths.
 * Keys are exact or dynamic paths (e.g., '/budgets/summary/detail/[id]'),
 * values are arrays of breadcrumb items.
 */
export const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ title: 'Home', link: '/' }],
  '/account': [{ title: 'Account', link: '/account' }],
  '/account/update': [
    { title: 'Account', link: '/account' },
    { title: 'Update', link: '/account/update' },
  ],
  '/account/create': [
    { title: 'Account', link: '/account' },
    { title: 'Create', link: '/account/create' },
  ],
  '/transaction': [{ title: 'Transaction', link: '/transaction' }],
  '/transaction/details': [
    { title: 'Transaction', link: '/transaction' },
    { title: 'Details', link: '/transaction/details' },
  ],
  '/category': [{ title: 'Category', link: '/category' }],
  '/category/create': [
    { title: 'Category', link: '/category' },
    { title: 'Create', link: '/category/create' },
  ],
  '/category/update': [
    { title: 'Category', link: '/category' },
    { title: 'Update', link: '/category/update' },
  ],
  '/setting/product/update': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Update', link: '/setting/product/update' },
  ],
  '/setting/product/create': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Create', link: '/setting/product/create' },
  ],
  '/budgets': [{ title: 'Budgets', link: '/budgets' }],
  '/finance/chart': [{ title: 'Finance Report', link: '/finance/chart' }],
  '/budgets/create': [
    { title: 'Budgets', link: '/budgets' },
    { title: 'Create', link: '/budgets/create' },
  ],
  '/budgets/update/[id]': [
    { title: 'Budgets', link: '/budgets' },
    { title: 'Update', link: '/budgets/update/[id]' },
  ],
  '/budgets/summary': [
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary' },
  ],
  '/budgets/summary/detail/[year]': [
    { title: 'Home', link: '/' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
    { title: 'Detail', link: '/budgets/summary/detail/[year]' },
  ],
  '/setting/landing': [{ title: 'Landing Setting', link: '/setting/landing' }],
  '/setting/exchange-rate': [{ title: 'Exchange Rate Setting', link: '/setting/exchange-rate' }],
  '/setting/membership': [{ title: 'Membership Setting', link: '/setting/membership' }],
};

/**
 * Regular expression to match UUID format for skipping segments.
 */
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Normalizes a segment into a display title using custom titles or capitalization.
 * @param segment - The URL segment to normalize (e.g., "create").
 * @param customTitles - Optional custom titles for segments.
 * @returns The normalized title (e.g., "Create").
 */
export const normalizeSegment = (
  segment: string,
  customTitles?: Record<string, string>,
): string => {
  return customTitles?.[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
};

/**
 * Determines if a segment should be skipped based on configuration.
 * @param segment - The current segment to check.
 * @param index - The index of the segment in the segments array.
 * @param segments - The array of all segments.
 * @param config - The breadcrumb configuration.
 * @returns True if the segment should be skipped.
 */
export const shouldSkipSegment = (
  segment: string,
  index: number,
  segments: string[],
  config: BreadcrumbConfig,
): boolean => {
  if (config.excludeSegments?.includes(segment)) return true;

  if (
    config.skipUuidAfter &&
    index > 0 &&
    config.skipUuidAfter.includes(segments[index - 1]) &&
    segment.match(uuidRegex)
  ) {
    return true;
  }

  if (index > 0 && /^\d+$/.test(segment) && config.skipUuidAfter?.includes(segments[index - 1])) {
    return true;
  }

  return false;
};

/**
 * Builds breadcrumb items dynamically from URL segments.
 * @param segments - The array of URL segments.
 * @param config - The breadcrumb configuration.
 * @returns Array of breadcrumb items.
 */
export const buildBreadcrumbItems = (
  segments: string[],
  config: BreadcrumbConfig,
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [];
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    if (shouldSkipSegment(segment, i, segments, config)) continue;

    items.push({ title: normalizeSegment(segment, config.customTitles), link: currentPath });
  }

  return items;
};

/**
 * Replaces placeholders in a link with values based on configuration mappings.
 * @param link - The link containing placeholders (e.g., '/budgets/summary/[year]').
 * @param segments - The array of URL segments.
 * @param searchParams - The URL search parameters.
 * @param config - The breadcrumb configuration.
 * @returns The link with placeholders replaced.
 */
const replacePlaceholdersInLink = (
  link: string,
  segments: string[],
  searchParams: ReadonlyURLSearchParams | null,
  config: BreadcrumbConfig,
): string => {
  let updatedLink = link;
  const placeholderRegex = /\[([^\]]+)\]/g;

  for (const match of link.matchAll(placeholderRegex)) {
    const placeholder = match[0];
    const key = match[1];
    const mapping = config.placeholderMappings?.[key];

    if (mapping) {
      const value = mapping(segments, searchParams);
      if (value) updatedLink = updatedLink.replace(placeholder, value);
    }
  }

  return updatedLink;
};

/**
 * React hook to generate breadcrumbs based on the current pathname.
 * @param customConfig - Optional custom configuration to override defaults.
 * @returns Array of breadcrumb items for the current path.
 */
export function useBreadcrumbs(customConfig: Partial<BreadcrumbConfig> = {}): BreadcrumbItem[] {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams(); // Returns ReadonlyURLSearchParams | null
  const segments = pathname.split('/').filter(Boolean);

  const config: BreadcrumbConfig = { ...breadcrumbConfig, ...customConfig };
  const effectiveSearchParams = searchParams || new ReadonlyURLSearchParams(); // Default to empty if null

  return useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname].map((item) => ({
        ...item,
        link: replacePlaceholdersInLink(item.link, segments, effectiveSearchParams, config),
      }));
    }

    const dynamicRoute = Object.keys(routeMapping).find((route) => {
      const routeSegments = route.split('/').filter(Boolean);
      if (routeSegments.length !== segments.length) return false;

      return routeSegments.every((routeSeg, i) =>
        routeSeg.startsWith('[') && routeSeg.endsWith(']') ? true : routeSeg === segments[i],
      );
    });

    if (dynamicRoute) {
      return routeMapping[dynamicRoute].map((item) => ({
        ...item,
        link: replacePlaceholdersInLink(item.link, segments, effectiveSearchParams, config),
      }));
    }

    const items = buildBreadcrumbItems(segments, config);
    if (items.length > 0 && items[0].title !== 'Home') {
      items.unshift({ title: 'Home', link: '/' });
    }

    return items;
  }, [pathname, effectiveSearchParams, config]);
}
