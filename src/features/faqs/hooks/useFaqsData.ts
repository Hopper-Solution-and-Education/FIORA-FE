import { useState, useCallback, useEffect } from 'react';
import { useGetFaqsMutation } from '../store/api/faqsApi';
import { CategoryWithFaqs } from '../domain/repositories/IFaqsRepository';
import { FaqsFilterValues } from '../presentation/molecules/FaqsFilter';

// Constants
const FAQS_PER_CATEGORY = 4;
const MOST_VIEWED_LIMIT = 8;

export const useFaqsData = () => {
  // State
  const [activeFilters, setActiveFilters] = useState<FaqsFilterValues>({
    search: '',
    categories: [],
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [mostViewedFaqs, setMostViewedFaqs] = useState<any[]>([]);
  const [categoriesWithFaqs, setCategoriesWithFaqs] = useState<CategoryWithFaqs[]>([]);
  const [expandedCategoryFaqs, setExpandedCategoryFaqs] = useState<Record<string, any[]>>({});
  const [filterResults, setFilterResults] = useState<any[]>([]);

  // API
  const [getFaqs, { isLoading }] = useGetFaqsMutation();

  // Computed values
  const hasActiveFilters =
    activeFilters.search.trim().length > 0 || activeFilters.categories.length > 0;

  // Load most viewed FAQs and categories data
  const loadInitialData = useCallback(async () => {
    try {
      // Load most viewed FAQs
      const mostViewedResponse = await getFaqs({
        type: 'most-viewed',
        limit: MOST_VIEWED_LIMIT,
        search: '',
      }).unwrap();

      if ('faqs' in mostViewedResponse) {
        setMostViewedFaqs(mostViewedResponse.faqs);
      }

      // Load categories with FAQs
      const categoriesResponse = await getFaqs({
        type: 'by-categories',
        limit: FAQS_PER_CATEGORY,
        search: '',
      }).unwrap();

      if ('categoriesData' in categoriesResponse) {
        setCategoriesWithFaqs(categoriesResponse.categoriesData);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }, [getFaqs]);

  // Load initial data
  useEffect(() => {
    if (!hasActiveFilters) {
      loadInitialData();
    }
  }, [hasActiveFilters, loadInitialData]);

  // Handle filter submission
  const handleFilterSubmit = useCallback(
    async (filters: FaqsFilterValues) => {
      setActiveFilters(filters);
      setExpandedCategories(new Set());

      if (filters.search.trim() || filters.categories.length > 0) {
        try {
          const response = await getFaqs({
            filters: {
              userId: '',
              filters: { search: filters.search, categories: filters.categories },
            },
          }).unwrap();

          if ('faqs' in response) {
            setFilterResults(response.faqs);
          }
        } catch (error) {
          console.error('Failed to filter FAQs:', error);
          setFilterResults([]);
        }
      } else {
        // Reset to initial data when filters are cleared
        setFilterResults([]);
        loadInitialData();
      }
    },
    [getFaqs, loadInitialData],
  );

  // Handle category expansion
  const handleShowMore = useCallback(
    async (categoryId: string) => {
      if (expandedCategories.has(categoryId)) {
        // Collapse category
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(categoryId);
          return newSet;
        });
      } else {
        // Expand category - load all FAQs for this category
        try {
          const response = await getFaqs({
            type: 'by-category',
            categoryId,
            search: '',
          }).unwrap();

          if ('faqs' in response) {
            setExpandedCategoryFaqs((prev) => ({
              ...prev,
              [categoryId]: response.faqs,
            }));
          }

          setExpandedCategories((prev) => new Set([...prev, categoryId]));
        } catch (error) {
          console.error('Failed to load category FAQs:', error);
        }
      }
    },
    [getFaqs, expandedCategories],
  );

  // Helper function to get filter display text
  const getFilterDisplayText = useCallback(() => {
    const { search, categories } = activeFilters;
    const hasSearch = search.trim().length > 0;
    const hasCategories = categories.length > 0;

    if (hasSearch && hasCategories) {
      const categoriesText =
        categories.length === 1 ? categories[0] : `${categories.length} categories`;
      return `Search results for "${search}" in ${categoriesText}`;
    }

    if (hasSearch) return `Search results for "${search}"`;
    if (hasCategories) {
      return categories.length === 1
        ? `FAQs in ${categories[0]}`
        : `FAQs in ${categories.length} selected categories`;
    }

    return 'Filter Results';
  }, [activeFilters]);

  return {
    // State
    activeFilters,
    expandedCategories,
    mostViewedFaqs,
    categoriesWithFaqs,
    expandedCategoryFaqs,
    filterResults,
    isLoading,
    hasActiveFilters,

    // Actions
    handleFilterSubmit,
    handleShowMore,
    getFilterDisplayText,

    // Constants
    FAQS_PER_CATEGORY,
  };
};
