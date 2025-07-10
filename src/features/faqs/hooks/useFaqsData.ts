import { useState, useCallback, useMemo, useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetFaqsQuery } from '../store/api/faqsApi';
import { FAQ_LIST_CONSTANTS } from '../constants/index';
import { CategoryWithFaqs, Faq, FaqsGetListType } from '../domain/entities/models/faqs';
import { FaqsFilterValues } from '../presentation/organisms/FaqsPageHeader';

export const useFaqsData = () => {
  // State
  const [activeFilters, setActiveFilters] = useState<FaqsFilterValues>({
    search: '',
    categories: [],
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedCategoryFaqs, setExpandedCategoryFaqs] = useState<Record<string, Faq[]>>({});
  const [expandingCategoryId, setExpandingCategoryId] = useState<string | null>(null);

  // Computed values
  const hasActiveFilters =
    activeFilters.search.trim().length > 0 || activeFilters.categories.length > 0;

  // Query parameters for most viewed FAQs
  const mostViewedQueryParams = useMemo(
    () => ({
      type: FaqsGetListType.LIST,
      limit: FAQ_LIST_CONSTANTS.MOST_VIEWED_LIMIT,
      filters: { search: '', categories: [] },
    }),
    [],
  );

  // Query parameters for categories with FAQs
  const categoriesQueryParams = useMemo(
    () => ({
      type: FaqsGetListType.CATEGORIES,
      limit: FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY,
      filters: { search: '', categories: [] },
    }),
    [],
  );

  // Query parameters for filtered results
  const filteredQueryParams = useMemo(
    () =>
      hasActiveFilters
        ? {
            type: FaqsGetListType.LIST,
            filters: {
              search: activeFilters.search,
              categories: activeFilters.categories,
            },
          }
        : skipToken,
    [hasActiveFilters, activeFilters.search, activeFilters.categories],
  );

  // Query for expanded category (triggered manually)
  const expandedCategoryQueryParams = useMemo(
    () =>
      expandingCategoryId
        ? {
            type: FaqsGetListType.LIST,
            filters: { categories: [expandingCategoryId] },
          }
        : skipToken,
    [expandingCategoryId],
  );

  // API Queries
  const { data: mostViewedResponse, isLoading: isLoadingMostViewed } = useGetFaqsQuery(
    mostViewedQueryParams,
    {
      skip: hasActiveFilters,
    },
  );

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetFaqsQuery(
    categoriesQueryParams,
    {
      skip: hasActiveFilters,
    },
  );

  const { data: filteredResponse, isLoading: isLoadingFiltered } = useGetFaqsQuery(
    filteredQueryParams,
    {
      skip: !hasActiveFilters,
    },
  );

  // Query for expanded category
  const { data: expandedCategoryResponse, isLoading: isLoadingExpandedCategory } = useGetFaqsQuery(
    expandedCategoryQueryParams,
    {
      skip: !expandingCategoryId,
    },
  );

  // Handle expanded category response
  useEffect(() => {
    if (expandedCategoryResponse && 'faqs' in expandedCategoryResponse && expandingCategoryId) {
      setExpandedCategoryFaqs((prev) => ({
        ...prev,
        [expandingCategoryId]: expandedCategoryResponse.faqs,
      }));
      setExpandingCategoryId(null);
    }
  }, [expandedCategoryResponse, expandingCategoryId]);

  // Extract data from responses
  const mostViewedFaqs: Faq[] = useMemo(() => {
    if (mostViewedResponse && 'faqs' in mostViewedResponse) {
      return mostViewedResponse.faqs;
    }
    return [];
  }, [mostViewedResponse]);

  const categoriesWithFaqs: CategoryWithFaqs[] = useMemo(() => {
    if (categoriesResponse && 'categoriesData' in categoriesResponse) {
      return categoriesResponse.categoriesData;
    }
    return [];
  }, [categoriesResponse]);

  const filteredFaqs: Faq[] = useMemo(() => {
    if (filteredResponse && 'faqs' in filteredResponse) {
      return filteredResponse.faqs;
    }
    return [];
  }, [filteredResponse]);

  // Loading state
  const isLoading =
    isLoadingMostViewed || isLoadingCategories || isLoadingFiltered || isLoadingExpandedCategory;

  // Handle filter changes
  const handleFilterChange = useCallback((filters: FaqsFilterValues) => {
    setActiveFilters(filters);
    setExpandedCategories(new Set());
    setExpandedCategoryFaqs({});
    setExpandingCategoryId(null);
  }, []);

  // Handle category expansion
  const handleShowMore = useCallback(
    (categoryId: string) => {
      if (expandedCategories.has(categoryId)) {
        // Collapse category
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(categoryId);
          return newSet;
        });
        setExpandedCategoryFaqs((prev) => {
          const newData = { ...prev };
          delete newData[categoryId];
          return newData;
        });
      } else {
        // Expand category - trigger query
        setExpandedCategories((prev) => new Set([...prev, categoryId]));
        setExpandingCategoryId(categoryId);
      }
    },
    [expandedCategories],
  );

  return {
    // State
    activeFilters,
    expandedCategories,
    mostViewedFaqs,
    categoriesWithFaqs,
    expandedCategoryFaqs,
    filteredFaqs,
    isLoading,
    hasActiveFilters,

    // Actions
    handleFilterChange,
    handleShowMore,
  };
};
