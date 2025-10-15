'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useUserManagement } from '../hooks/useUserManagement';
import { UserTable } from '../organisms/UserCommonTable';

export default function UserManagementPage() {
  const router = useRouter();
  const {
    tableData,
    searchQuery,
    setSearchQuery,
    appliedFilters,
    isLoading,
    error,
    setFilters,
    stats,
    pendingTotal,
    hasMore,
    loadMore,
    isLoadingMore,
  } = useUserManagement();

  const handleUserAction = (userId: string) => {
    router.push(`/ekyc/${encodeURIComponent(userId)}/profile`);
    // console.log('User action for ID:', userId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
      </div>

      <Card>
        <CardContent>
          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-600">Failed to load users. Please try again.</p>
            </div>
          )}

          {/* User Table */}
          <div className="p-4">
            <UserTable
              users={tableData.data}
              onUserAction={handleUserAction}
              searchQuery={searchQuery}
              filters={appliedFilters}
              onSearchChange={setSearchQuery}
              onFilterChange={setFilters}
              totalActive={stats.totalActive}
              totalBlocked={stats.totalBlocked}
              totalPending={pendingTotal}
              hasMore={hasMore}
              onLoadMore={loadMore}
              isLoadingMore={isLoadingMore}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
