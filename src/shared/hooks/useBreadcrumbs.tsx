// breadcrumbUtils.ts

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Represents a single breadcrumb item with a title and a link.
 * @typedef {Object} BreadcrumbItem
 * @property {string} title - The display title of the breadcrumb item (e.g., "Home", "Category").
 * @property {string} link - The URL path for the breadcrumb item (e.g., "/", "/category").
 */
export type BreadcrumbItem = {
  title: string;
  link: string;
};

/**
 * Configuration options for customizing breadcrumb behavior.
 * @typedef {Object} BreadcrumbConfig
 * @property {string[]} [excludeSegments] - Segments to exclude from the breadcrumb (e.g., ['setting']).
 * @property {Record<string, string>} [customTitles] - Custom titles for specific segments (e.g., { create: 'Create' }).
 * @property {string[]} [displaySegments] - Only display these segments in the breadcrumb (if provided).
 * @property {string[]} [skipUuidAfter] - Skip UUID segments that appear after these segments (e.g., ['update']).
 */
export type BreadcrumbConfig = {
  excludeSegments?: string[]; // Segments to exclude (e.g., UUIDs, specific segments)
  customTitles?: Record<string, string>; // Custom titles for segments (e.g., { create: 'Create' })
  displaySegments?: string[]; // Only display these segments (if provided)
  skipUuidAfter?: string[]; // Skip UUID after these segments (e.g., ['update'])
};

/**
 * Default configuration for breadcrumb behavior.
 * @constant {BreadcrumbConfig}
 * @default
 */
const defaultConfig: BreadcrumbConfig = {
  excludeSegments: ['setting'], // Bỏ qua segment "setting" mặc định
  customTitles: {
    create: 'Create',
    update: 'Update',
    details: 'Details',
  },
  displaySegments: undefined,
  skipUuidAfter: ['update', 'details'],
};

/**
 * Static route mapping for predefined breadcrumb paths.
 * Maps a pathname to an array of breadcrumb items.
 * @constant {Record<string, BreadcrumbItem[]>}
 * @example
 * ```tsx
 * routeMapping['/category'] = [
 *   { title: 'Home', link: '/' },
 *   { title: 'Category', link: '/category' }
 * ];
 * ```
 */
export const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ title: 'Home', link: '/' }],
  '/account': [
    { title: 'Home', link: '/' },
    { title: 'Account', link: '/account' },
  ],
  '/account/update': [
    { title: 'Home', link: '/' },
    { title: 'Account', link: '/account' },
    { title: 'Update', link: '/account/update' },
  ],
  '/account/create': [
    { title: 'Home', link: '/' },
    { title: 'Account', link: '/account' },
    { title: 'Create', link: '/account/create' },
  ],
  '/transaction': [
    { title: 'Home', link: '/' },
    { title: 'Transaction', link: '/transaction' },
  ],
  '/transaction/details': [
    { title: 'Home', link: '/' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Details', link: '/transaction/details' },
  ],
  '/category': [
    { title: 'Home', link: '/' },
    { title: 'Category', link: '/category' },
  ],
  '/category/create': [
    { title: 'Home', link: '/' },
    { title: 'Category', link: '/category' },
    { title: 'Create', link: '/category/create' },
  ],
  '/category/update': [
    { title: 'Home', link: '/' },
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
  '/budgets': [
    { title: 'Home', link: '/' },
    { title: 'Budgets', link: '/budgets' },
  ],
  '/budgets/create': [
    { title: 'Home', link: '/' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Create', link: '/budgets/create' },
  ],
};

/**
 * Regular expression to match UUID format.
 * Used to identify segments that are UUIDs and skip them if necessary.
 * @constant {RegExp}
 */
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Normalizes a segment into a display title.
 * Applies custom titles if provided, otherwise capitalizes the first letter.
 * @param {string} segment - The URL segment to normalize (e.g., "create").
 * @param {Record<string, string>} [customTitles] - Custom titles for segments (e.g., { create: 'Create' }).
 * @returns {string} The normalized title (e.g., "Create").
 * @example
 * ```tsx
 * normalizeSegment('create', { create: 'Create' }); // Returns "Create"
 * normalizeSegment('product'); // Returns "Product"
 * ```
 */
export const normalizeSegment = (
  segment: string,
  customTitles?: Record<string, string>,
): string => {
  if (customTitles && customTitles[segment]) {
    return customTitles[segment];
  }
  return segment.charAt(0).toUpperCase() + segment.slice(1);
};

/**
 * Determines if a segment should be skipped in the breadcrumb.
 * @param {string} segment - The current segment to check (e.g., "setting").
 * @param {number} index - The index of the segment in the segments array.
 * @param {string[]} segments - The array of all segments in the pathname.
 * @param {BreadcrumbConfig} config - The configuration for breadcrumb behavior.
 * @returns {boolean} True if the segment should be skipped, false otherwise.
 * @example
 * ```tsx
 * const config = { excludeSegments: ['setting'] };
 * shouldSkipSegment('setting', 0, ['setting', 'product'], config); // Returns true
 * shouldSkipSegment('product', 1, ['setting', 'product'], config); // Returns false
 * ```
 */
export const shouldSkipSegment = (
  segment: string,
  index: number,
  segments: string[],
  config: BreadcrumbConfig,
): boolean => {
  // Skip if segment is in excludeSegments
  if (config.excludeSegments?.includes(segment)) {
    return true;
  }

  // Skip if segment is a UUID and the previous segment is in skipUuidAfter
  if (
    config.skipUuidAfter &&
    index > 0 &&
    config.skipUuidAfter.includes(segments[index - 1]) &&
    segment.match(uuidRegex)
  ) {
    return true;
  }

  // Skip if displaySegments is provided and segment is not in it
  if (config.displaySegments && !config.displaySegments.includes(segment)) {
    return true;
  }

  return false;
};

/**
 * Builds breadcrumb items from URL segments.
 * @param {string[]} segments - The array of URL segments (e.g., ['setting', 'product', 'update']).
 * @param {BreadcrumbConfig} config - The configuration for breadcrumb behavior.
 * @returns {BreadcrumbItem[]} An array of breadcrumb items.
 * @example
 * ```tsx
 * const segments = ['setting', 'product', 'update'];
 * const config = { excludeSegments: ['setting'] };
 * buildBreadcrumbItems(segments, config);
 * // Returns:
 * // [
 * //   { title: 'Product', link: '/setting/product' },
 * //   { title: 'Update', link: '/setting/product/update' }
 * // ]
 * ```
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

    // Skip segment if it matches the skip conditions
    if (shouldSkipSegment(segment, i, segments, config)) {
      continue;
    }

    const title = normalizeSegment(segment, config.customTitles);
    items.push({
      title,
      link: currentPath,
    });
  }

  return items;
};

/**
 * A React hook to generate breadcrumbs based on the current pathname.
 * @param {BreadcrumbConfig} [config=defaultConfig] - Configuration for customizing breadcrumb behavior.
 * @returns {BreadcrumbItem[]} An array of breadcrumb items representing the current path.
 * @example
 * ```tsx
 * // Basic usage with default config
 * const breadcrumbs = useBreadcrumbs();
 * // For pathname '/setting/product/create', returns:
 * // [
 * //   { title: 'Product', link: '/setting/product' },
 * //   { title: 'Create', link: '/setting/product/create' }
 * // ]
 *
 * // Custom config to include 'setting'
 * const customBreadcrumbs = useBreadcrumbs({ excludeSegments: [] });
 * // For pathname '/setting/product/create', returns:
 * // [
 * //   { title: 'Setting', link: '/setting' },
 * //   { title: 'Product', link: '/setting/product' },
 * //   { title: 'Create', link: '/setting/product/create' }
 * // ]
 * ```
 */
export function useBreadcrumbs(config: BreadcrumbConfig = defaultConfig): BreadcrumbItem[] {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = useMemo(() => {
    // Check for exact path mappings first
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Build breadcrumbs dynamically using segments
    return buildBreadcrumbItems(segments, config);
  }, [pathname, segments, config]);

  return breadcrumbs;
}
