import { breadcrumbConfig, BreadcrumbConfig } from '@/shared/configs/breadcrumbConfig';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

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

  // ACCOUNT
  '/account': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
  ],
  '/account/update/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
    { title: 'Update', link: '/account/update/[id]' },
  ],
  '/account/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Account', link: '/account' },
    { title: 'Create', link: '/account/create' },
  ],

  // TRANSACTION
  '/transaction': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
  ],
  '/profile': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Profile', link: '/profile' },
  ],
  '/profile/ekyc': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Profile', link: '/profile' },
    { title: 'eKYC', link: '/profile/ekyc' },
  ],
  '/transaction/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Create', link: '/transaction/create' },
  ],
  '/transaction/details/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Details', link: '/transaction/details/[id]' },
  ],
  '/transaction/edit/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Transaction', link: '/transaction' },
    { title: 'Edit', link: '/transaction/edit/[id]' },
  ],

  // CATEGORY
  '/category': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
  ],
  '/category/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
    { title: 'Create', link: '/category/create' },
  ],
  '/category/update/[id]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Category', link: '/category' },
    { title: 'Update', link: '/category/update/[id]' },
  ],

  // FINANCE REPORT
  '/finance/report': [{ title: 'Finance', link: '/finance/report' }],

  // BUDGET
  '/budgets': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
  ],
  '/budgets/create': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Create', link: '/budgets/create' },
  ],
  '/budgets/summary/update/[year]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
    { title: 'Update', link: '/budgets/summary/update/[year]' },
  ],
  '/budgets/summary/[year]': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
  ],
  '/budgets/summary/detail/[year]': [
    { title: 'Budgets', link: '/budgets' },
    { title: 'Summary', link: '/budgets/summary/[year]' },
    { title: 'Detail', link: '/budgets/summary/detail/[year]' },
  ],

  // WALLET
  '/wallet': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Wallet', link: '/wallet' },
  ],
  '/wallet/deposit': [
    { title: 'Finance', link: '/finance/report' },
    { title: 'Wallet', link: '/wallet' },
    { title: 'Deposit', link: '/wallet/deposit' },
  ],

  // MEMBERSHIP
  '/membership': [{ title: 'Membership', link: '/membership' }],

  // HELPS CENTER
  '/helps-center/about-us': [{ title: 'About Us', link: '/helps-center/about-us' }],
  '/helps-center/about-us/edit/[id]': [
    { title: 'About Us', link: '/helps-center/about-us' },
    { title: 'Edit', link: '/helps-center/about-us/edit/[id]' },
  ],
  '/helps-center/faqs': [{ title: 'FAQs', link: '/helps-center/faqs' }],
  '/helps-center/faqs/details/[id]': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Details', link: '/helps-center/faqs/details/[id]' },
  ],
  '/helps-center/faqs/details/[id]/edit': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Details', link: '/helps-center/faqs/details/[id]' },
    { title: 'Edit', link: '/helps-center/faqs/details/[id]/edit' },
  ],
  '/helps-center/faqs/create': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Create', link: '/helps-center/faqs/create' },
  ],
  '/helps-center/faqs/import': [
    { title: 'FAQs', link: '/helps-center/faqs' },
    { title: 'Import', link: '/helps-center/faqs/import' },
  ],
  '/helps-center/contact-us': [{ title: 'Contact Us', link: '/helps-center/contact-us' }],
  '/helps-center/terms-and-conditions': [
    { title: 'Terms and Conditions', link: '/helps-center/terms-and-conditions' },
  ],
  '/helps-center/user-tutorial': [{ title: 'User Tutorial', link: '/helps-center/user-tutorial' }],
  '/helps-center/user-tutorial/edit/[id]': [
    { title: 'User Tutorial', link: '/helps-center/user-tutorial' },
    { title: 'Edit', link: '/helps-center/user-tutorial/edit/[id]' },
  ],
  '/helps-center/terms-and-conditions/edit/[id]': [
    { title: 'Terms and Conditions', link: '/helps-center/terms-and-conditions' },
    { title: 'Edit', link: '/helps-center/terms-and-conditions/edit/[id]' },
  ],

  // NEWS
  '/news': [{ title: 'News', link: '/news' }],
  '/news/details/[id]/edit': [
    { title: 'News', link: '/news' },
    { title: 'Details', link: '/news/details/[id]' },
    { title: 'Edit', link: '/news/details/[id]/edit' },
  ],
  '/news/details/[id]': [
    { title: 'News', link: '/news' },
    { title: 'Details', link: '/news/details/[id]' },
  ],
  '/news/create': [
    { title: 'News', link: '/news' },
    { title: 'Create', link: '/news/create' },
  ],

  // SETTING
  '/setting/landing': [{ title: 'Landing Setting', link: '/setting/landing' }],
  '/setting/exchange-rate': [{ title: 'Exchange Rate Setting', link: '/setting/exchange-rate' }],
  '/setting/membership': [{ title: 'Membership Setting', link: '/setting/membership' }],
  '/setting/product': [{ title: 'Product', link: '/setting/product' }],
  '/setting/product/update/[id]': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Update', link: '/setting/product/update/[id]' },
  ],
  '/setting/product/create': [
    { title: 'Product', link: '/setting/product' },
    { title: 'Create', link: '/setting/product/create' },
  ],
  '/setting/partner': [{ title: 'Partner', link: '/setting/partner' }],
  '/setting/partner/update/[id]': [
    { title: 'Partner', link: '/setting/partner' },
    { title: 'Update', link: '/setting/partner/update/[id]' },
  ],
  '/setting/partner/create': [
    { title: 'Partner', link: '/setting/partner' },
    { title: 'Create', link: '/setting/partner/create' },
  ],
  '/setting/wallet': [{ title: 'Deposit FX', link: '/setting/wallet' }],
  '/setting/notification': [{ title: 'Notification', link: '/setting/notification' }],
  '/setting/packagefx': [{ title: 'Package FX', link: '/setting/packagefx' }],
  '/setting/packagefx/create': [
    { title: 'Package FX', link: '/setting/packagefx' },
    { title: 'Create', link: '/setting/packagefx/create' },
  ],
  '/setting/packagefx/edit/[id]': [
    { title: 'Package FX', link: '/setting/packagefx' },
    { title: 'Edit', link: '' },
  ],
  '/setting/cron-job/membership': [
    { title: 'Cron Job', link: '/setting/cron-job' },
    { title: 'Membership', link: '/setting/cron-job/membership' },
  ],
};

/**
 * Regular expression to match UUID format for skipping segments.
 */
const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

// Giữ regex uuidRegex hiện có
const numberRegex = /^\d+$/;

const getIdFromSegments = (segments: string[]) => {
  // Ưu tiên UUID, nếu không có thì lấy số
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (uuidRegex.test(s)) return s;
  }
  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (numberRegex.test(s)) return s;
  }
  return ''; // không tìm thấy
};

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

    // 1) Ưu tiên dùng mapping từ config (nếu có)
    const mapping = config.placeholderMappings?.[key];
    let value = mapping ? (mapping(segments, searchParams) ?? '') : '';

    // 2) Fallback: nếu chưa có value và key là "id", tự bắt từ segments
    if (!value && key === 'id') {
      value = getIdFromSegments(segments);
    }

    // 3) Có thể thêm các fallback khác (vd year) nếu muốn:
    if (value) {
      updatedLink = updatedLink.replace(placeholder, value);
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
  const pathname = (usePathname() || '').replace(/\/+$/, ''); // bỏ trailing slash
  const searchParams = useSearchParams(); // trong Client luôn có, không cần new ReadonlyURLSearchParams
  const segments = pathname.split('/').filter(Boolean);

  const config: BreadcrumbConfig = { ...breadcrumbConfig, ...customConfig };

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
