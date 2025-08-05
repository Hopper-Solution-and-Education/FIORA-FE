import { useEffect, useMemo, useRef, useState } from 'react';

type SortField = 'fxAmount' | 'createdAt';
type SortOrder = 'asc' | 'desc';

type ApiResp<T> = {
  status: number;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export function usePackageFxInfiniteData(params: {
  sortField: SortField;
  sortOrder: SortOrder;
  limit?: number;
}) {
  const { sortField, sortOrder, limit = 20 } = params;
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const hasMore = useMemo(() => items.length < total, [items.length, total]);

  const fetchPage = async (p: number) => {
    if (isFetching) return;
    setIsFetching(true);
    setError(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const qs = new URLSearchParams({
      page: String(p),
      limit: String(limit),
      sortBy: JSON.stringify({ [sortField]: sortOrder }),
    });

    try {
      const res = await fetch(`/api/wallet/package?${qs.toString()}`, { signal: ac.signal });
      const json: ApiResp<any> = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Fetch failed');

      setTotal(json.total ?? 0);
      setItems((prev) => (p === 1 ? json.data : [...prev, ...json.data]));
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message || 'Unknown error');
    } finally {
      setIsFetching(false);
      setIsInitialLoading(false);
    }
  };
  useEffect(() => {
    setItems([]);
    setTotal(0);
    setPage(1);
    setIsInitialLoading(true);
    fetchPage(1);
  }, [sortField, sortOrder, limit]);

  const loadMore = () => {
    if (isFetching || !hasMore) return;
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  };
  const refetch = () => {
    setItems([]);
    setTotal(0);
    setPage(1);
    setIsInitialLoading(true);
    fetchPage(1);
  };
  return { items, total, page, hasMore, isInitialLoading, isFetching, error, loadMore, refetch };
}
