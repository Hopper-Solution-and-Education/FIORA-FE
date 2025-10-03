import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FilterState, User } from '../../slices/type';
import { useGetCountUsersQuery, useGetUsersQuery, UserApiResponse } from '../../store/api/userApi';

export function useUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    roles: [],
    status: [],
    fromDate: null,
    toDate: null,
  });
  const [page, setPage] = useState(1);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const selectedDateRange: DateRange | undefined = useMemo(() => {
    if (appliedFilters.fromDate || appliedFilters.toDate) {
      return {
        from: appliedFilters.fromDate || undefined,
        to: appliedFilters.toDate || undefined,
      };
    }
    return undefined;
  }, [appliedFilters.fromDate, appliedFilters.toDate]);

  // Build API query params
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      pageSize: 20,
    };

    if (appliedFilters.roles && appliedFilters.roles.length > 0) {
      params.roles = appliedFilters.roles;
    }

    // Add status filters (exclude 'all' option)
    if (appliedFilters.status && appliedFilters.status.length > 0) {
      const filteredStatus = appliedFilters.status.filter((status) => status !== 'all');
      if (filteredStatus.length > 0) {
        params.status = filteredStatus;
      }
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // Format date range to ISO strings
    if (appliedFilters.fromDate) {
      const fromDate = new Date(appliedFilters.fromDate);
      fromDate.setHours(0, 0, 0, 0);
      params.fromDate = fromDate.toISOString().split('T')[0];
    }

    if (appliedFilters.toDate) {
      const toDate = new Date(appliedFilters.toDate);
      toDate.setHours(23, 59, 59, 999);
      params.toDate = toDate.toISOString().split('T')[0];
    }

    return params;
  }, [appliedFilters, searchQuery, page]);

  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery(queryParams);
  const { data: pendingCount } = useGetCountUsersQuery({ eKycStatus: 'PENDING' });

  const filteredUsers: User[] = useMemo(() => {
    const users = usersData?.data || [];
    if (!users.length) return [];

    return users.map(
      (user: UserApiResponse): User => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.isBlocked ? 'blocked' : 'active',
        creationDate: new Date(user.createdAt).toLocaleDateString('en-GB'),
        avatarUrl: user.avatarId ? `/api/avatar/${user.avatarId}` : null,
        eKYC: user.eKYC || [],
      }),
    );
  }, [usersData?.data]);

  const setFilters = useCallback((filters: FilterState) => {
    setAppliedFilters(filters);
    setPage(1);
    setShouldRefetch(true);
  }, []);

  const clearFilters = useCallback(() => {
    const resetFilters: FilterState = {
      roles: [],
      status: [],
      fromDate: null,
      toDate: null,
    };
    setAppliedFilters(resetFilters);
    setSearchQuery('');
    setPage(1);
    setShouldRefetch(true);
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [shouldRefetch, refetch]);

  const serverTotal = usersData?.total ?? usersData?.data?.length ?? 0;
  const hasMore = usersData?.hasMore ?? false;

  // Calculate statistics from server data
  const stats = useMemo(() => {
    const rawUsers = usersData?.data || [];
    const totalActive = rawUsers.filter((u) => !u.isBlocked).length;
    const totalBlocked = rawUsers.filter((u) => u.isBlocked).length;

    return { totalActive, totalBlocked };
  }, [usersData?.data]);

  return {
    // Search & Filters
    searchQuery,
    setSearchQuery,
    appliedFilters,
    selectedDateRange,
    setFilters,
    clearFilters,

    // Data
    filteredUsers,
    stats,

    // Loading states
    isLoading,
    error,

    // Pagination
    page,
    setPage,
    hasMore,
    total: serverTotal,
    pendingTotal: pendingCount ?? 0,
    displayedTotal: filteredUsers.length,

    // Actions
    refetch,
  };
}
