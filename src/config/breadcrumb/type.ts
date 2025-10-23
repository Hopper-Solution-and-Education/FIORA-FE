import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Represents a single breadcrumb item with a title and a link.
 */
export type BreadcrumbItem = {
  title: string;
  link: string;
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
