import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NewsQueryParams, NewsResponse } from '../api/types/newsDTO';
import { PostCategoryResponse } from '../api/types/postCategoryDTO';
import { NewsFilterValues } from '../presentation/organisms/NewsPageHeader';
import {
  useGetNewsCategoriesQuery,
  useGetNewsQuery,
  useLazyGetNewsQuery,
} from '../store/api/newsApi';

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

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  // const [expandedCategoryNews, setExpandedCategoryNews] = useState<Record<string, NewsResponse[]>>(
  //   {},
  // );

  // Computed values
  const hasActiveFilters =
    activeFilters.search.trim().length > 0 || activeFilters.categories.length > 0;

  const newestQueryParams = useMemo<NewsQueryParams>(
    () => ({
      page: 1,
      limit: 12,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }),
    [],
  );

  // API Queries
  const { data: newestResponse, isLoading: isLoadingNewestNewest } = useGetNewsQuery(
    newestQueryParams,
    { skip: false },
  );

  // const { data: filteredResponse, isLoading: isLoadingFilteredNews } = useGetNewsQuery(
  //   { ...newestQueryParams, filters: activeFilters },
  //   { skip: false },
  // );

  const { data: allCategoriesResponse, isLoading: isLoadingAllCategories } =
    useGetNewsCategoriesQuery(skipToken, { skip: false });

  const newestNewsList: NewsResponse[] = useMemo(() => {
    if (typeof newestResponse !== 'undefined' && 'news' in newestResponse) {
      return newestResponse.news;
    }
    return [];
  }, [newestResponse]);

  // const filteredNewsList: NewsResponse[] = useMemo(() => {
  //   if (typeof filteredResponse !== 'undefined' && 'news' in filteredResponse) {
  //     return filteredResponse.news;
  //   }
  //   return [];
  // }, [filteredResponse]);

  const allCategoriesList: PostCategoryResponse[] = useMemo(() => {
    if (typeof allCategoriesResponse !== 'undefined' && 'news' in allCategoriesResponse) {
      return allCategoriesResponse.news;
    }
    return [];
  }, [allCategoriesResponse]);

  const isLoading = isLoadingNewestNewest || isLoadingAllCategories;

  // Handle filter changes
  const handleFilterChange = useCallback((filters: NewsFilterValues) => {
    setActiveFilters(filters);
    setExpandedCategories(new Set());
    // setExpandedCategoryNews({});
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
        // add filters from activeFilters if needed:
        ...(activeFilters.search ? { search: activeFilters.search } : {}),
        ...(activeFilters.categories && activeFilters.categories.length
          ? { categories: activeFilters.categories }
          : {}),
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
    expandedCategories,
    allNews,
    isLoading,
    isFetchingPage,
    hasActiveFilters,
    allCategoriesList,

    // Actions
    handleFilterChange,
    handleLoadMoreNews,
  };
};
