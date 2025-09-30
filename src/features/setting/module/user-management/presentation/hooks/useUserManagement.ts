import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { FilterState } from '../../slices/types/index';
import { useGetUsersQuery } from '../../store/api/userApi';

export function useUserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempFilters, setTempFilters] = useState<FilterState>({
    roles: [],
    statuses: [],
    dateRange: '',
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    roles: [],
    statuses: [],
    dateRange: '',
  });
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined); // Add if missing
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      pageSize: 20,
    };

    if (appliedFilters.roles.length === 1) {
      params.role = appliedFilters.roles[0];
    }

    if (appliedFilters.statuses.length > 0) {
      params.status = appliedFilters.statuses;
    }

    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    if (selectedDateRange?.from && selectedDateRange?.to) {
      const fromDate = new Date(selectedDateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(selectedDateRange.to);
      toDate.setHours(23, 59, 59, 999);

      params.fromDate = fromDate.toISOString().split('T')[0];
      params.toDate = toDate.toISOString().split('T')[0];
    }

    return params;
  }, [appliedFilters.roles, appliedFilters.statuses, searchQuery, selectedDateRange, page]);

  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery(queryParams);

  const filteredUsers = useMemo(() => {
    const users = usersData?.data || [];
    if (!users.length) return [];

    return users
      .filter((user) => {
        const matchesSearch =
          !searchQuery ||
          (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

        const userStatus = user.isBlocked ? 'blocked' : 'active';
        const matchesStatus =
          appliedFilters.statuses.length === 0 || appliedFilters.statuses.includes(userStatus);

        return matchesSearch && matchesStatus;
      })
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.isBlocked ? 'blocked' : 'active',
        creationDate: new Date(user.createdAt).toLocaleDateString('en-GB'),
        avatarUrl: user.avatarId ? `/api/avatar/${user.avatarId}` : null,
      }));
  }, [usersData?.data, searchQuery, appliedFilters.statuses]);

  const handleRoleToggle = (role: string) => {
    setTempFilters((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleStatusToggle = (status: string) => {
    setTempFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range || undefined);
    if (range?.from && range?.to) {
      const formattedRange = `${range.from.toLocaleDateString('en-GB')} - ${range.to.toLocaleDateString('en-GB')}`;
      setTempFilters((prev) => ({ ...prev, dateRange: formattedRange }));
    } else {
      setTempFilters((prev) => ({ ...prev, dateRange: '' }));
    }
  };

  const clearFilters = () => {
    setTempFilters({
      roles: [],
      statuses: [],
      dateRange: '',
    });
    setSelectedDateRange(undefined);
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    setPage(1);
  };

  useEffect(() => {
    refetch();
  }, [appliedFilters, refetch]);

  const serverTotal = usersData?.total ?? usersData?.data?.length ?? 0;
  const hasMore = usersData?.hasMore ?? false;

  const rawUsers = usersData?.data ?? [];
  const totalActive = rawUsers.filter((u: any) => !u.isBlocked).length;
  const totalBlocked = rawUsers.filter((u: any) => !!u.isBlocked).length;
  const displayedTotal = filteredUsers.length;

  return {
    searchQuery,
    setSearchQuery,
    tempFilters,
    appliedFilters,
    selectedDateRange,
    filteredUsers,
    isLoading,
    error,
    hasMore,
    total: serverTotal,
    totalActive,
    totalBlocked,
    displayedTotal,
    page,
    setPage,
    handleRoleToggle,
    handleStatusToggle,
    handleDateRangeSelect,
    clearFilters,
    applyFilters,
    refetch,
  };
}
