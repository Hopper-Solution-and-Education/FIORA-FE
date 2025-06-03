import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Configuration for breadcrumb behavior, defining exclusions, custom titles, and placeholder mappings.
 */
export const breadcrumbConfig = {
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

export type BreadcrumbConfig = {
  excludeSegments?: string[];
  customTitles?: Record<string, string>;
  skipUuidAfter?: string[];
  placeholderMappings?: Record<
    string,
    (segments: string[], searchParams: ReadonlyURLSearchParams | null) => string | null
  >;
};
