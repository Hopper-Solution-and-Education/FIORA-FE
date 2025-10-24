import { BreadcrumbConfig, BreadcrumbItem } from '@/config/breadcrumb';
import { numberRegex, uuidRegex } from '@/shared/constants/regex';
import { ReadonlyURLSearchParams } from 'next/navigation';

export const getIdFromSegments = (segments: string[]) => {
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
export const replacePlaceholdersInLink = (
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
