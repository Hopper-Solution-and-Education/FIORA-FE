'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserManagement } from '../hooks/useUserManagement';
import { UserTable } from '../molecules/UserTable';
import { UserFilterDialog } from '../organisms/UserFilterDialog';

export default function UserManagementPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    tempFilters,
    selectedDateRange,
    filteredUsers,
    isLoading,
    error,
    total,
    handleRoleToggle,
    handleStatusToggle,
    handleDateRangeSelect,
    clearFilters,
    applyFilters,
  } = useUserManagement();

  const handleUserAction = (userId: string) => {
    // Handle user action - could open edit dialog, navigate to user profile, etc.
    router.push(`/profile/users/${encodeURIComponent(userId)}`);
    console.log('User action for ID:', userId);
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-baseline gap-2">
              <span>Users</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                disabled={isLoading}
              >
                <Filter className="h-6 w-5 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-600">Failed to load users. Please try again.</p>
            </div>
          )}

          {/* User Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 mr-2" />
              <span>Loading users...</span>
            </div>
          ) : (
            <UserTable
              users={filteredUsers.map((user: any) => ({
                ...user,
                id: String(user.id),
              }))}
              onUserAction={handleUserAction}
            />
          )}
        </CardContent>
      </Card>

      {/* Filter Dialog */}
      <UserFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        tempFilters={tempFilters}
        selectedDateRange={selectedDateRange}
        onRoleToggle={handleRoleToggle}
        onStatusToggle={handleStatusToggle}
        onDateRangeSelect={handleDateRangeSelect}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
      />
    </div>
  );
}
