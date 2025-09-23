import { useCallback, useEffect, useMemo, useState } from 'react';
import { NewsQueryParams, NewsResponse } from '../api/types/newsDTO';
import { PostCategoryResponse } from '../api/types/postCategoryDTO';
import { NewsFilterValues } from '../presentation/organisms/NewsPageHeader';
import { useGetNewsCategoriesQuery, useLazyGetNewsQuery } from '../store/api/newsApi';

export const useNewsData = () => {
  const [endOfNews, setEndOfNews] = useState(false);
  const [triggerGetNews, { isFetching: isFetchingPage }] = useLazyGetNewsQuery();

  // accumulated list of news (infinite scroll)
  const [allNews, setAllNews] = useState<NewsResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [activeFilters, setActiveFilters] = useState<NewsFilterValues>({
    search: '',
    categories: [],
  });

  // Computed values
  const hasActiveFilters =
    activeFilters.search.trim().length > 0 || activeFilters.categories.length > 0;

  const { data: allCategoriesResponse, isLoading: isLoadingAllCategories } =
    useGetNewsCategoriesQuery();

  const allCategoriesList: PostCategoryResponse[] = useMemo(() => {
    console.log('all', allCategoriesResponse);
    if (typeof allCategoriesResponse !== 'undefined') {
      return allCategoriesResponse;
    }
    return [];
  }, [allCategoriesResponse]);

  const isLoading = isLoadingAllCategories;

  // Handle filter changes
  const handleFilterChange = useCallback((filters: NewsFilterValues) => {
    setActiveFilters(filters);
    setEndOfNews(false);
  }, []);

  const baseQueryParams = useMemo<NewsQueryParams>(
    () => ({
      page: 1,
      limit,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }),
    [],
  );

  // fetch a page and append (or replace when page === 1)
  const fetchPage = useCallback(
    async (p: number) => {
      const q: NewsQueryParams = {
        ...baseQueryParams,
        page: p,
        limit,
        orderBy: 'createdAt',
        orderDirection: 'desc',
        filters: JSON.stringify({
          search: activeFilters.search || '',
          categories:
            activeFilters.categories && activeFilters.categories.length
              ? activeFilters.categories
              : [],
        }) as any,
      };

      try {
        const result = await triggerGetNews(q).unwrap();
        const pageNews = Array.isArray(result?.news) ? result.news : [];

        if (pageNews.length === 0) {
          setEndOfNews(true);
        }

        setAllNews((prev) => {
          if (p === 1) return pageNews;
          // append but dedupe by id
          const ids = new Set(prev.map((n) => n.id));
          const merged = [...prev];
          for (const n of pageNews) {
            if (!ids.has(n.id)) {
              merged.push(n);
            }
          }
          return merged;
        });

        // Optional: return whether there are more pages (if API returns total)
        return pageNews.length === limit ? true : false;
      } catch (e) {
        console.error(e);
        // triggerGetNews throws on network errors; keep previous state
        return false;
      }
    },
    [triggerGetNews, baseQueryParams, activeFilters, limit],
  );

  // initial load or when filters change => reset and load page 1
  useEffect(() => {
    setPage(1);
    setAllNews([]);
    fetchPage(1);
  }, [activeFilters, fetchPage]);

  // load more action (call from UI when user scrolls to bottom)
  const loadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  }, [page, fetchPage]);

  const handleLoadMoreNews = (q?: NewsQueryParams, setNews?: (v: NewsResponse[]) => void) => {
    if (q && setNews) {
      triggerGetNews(q)
        .unwrap()
        .then((res) => setNews(Array.isArray(res?.news) ? res.news : []))
        .catch(console.error);
      return;
    }
    loadMore();
  };

  return {
    // State
    endOfNews,
    activeFilters,
    allNews,
    // filteredNewsList,
    isLoading,
    isFetchingPage,
    hasActiveFilters,
    allCategoriesList,

    // Actions
    handleFilterChange,
    handleLoadMoreNews,
  };
};
