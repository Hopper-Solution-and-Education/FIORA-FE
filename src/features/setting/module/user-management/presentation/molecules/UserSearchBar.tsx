'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@prisma/client';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface UserSearchBarProps {
  onSearch?: (query: string) => void;
  onRoleFilter?: (role: UserRole | 'all') => void;
  onStatusFilter?: (status: string) => void;
  onClearFilters?: () => void;
  placeholder?: string;
  className?: string;
}

export function UserSearchBar({
  onSearch,
  onRoleFilter,
  onStatusFilter,
  onClearFilters,
  placeholder = 'Search users by name or email...',
  className,
}: UserSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleRoleChange = (role: UserRole | 'all') => {
    setSelectedRole(role);
    onRoleFilter?.(role);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onStatusFilter?.(status);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedStatus('all');
    onClearFilters?.();
  };

  const hasActiveFilters = searchQuery || selectedRole !== 'all' || selectedStatus !== 'all';

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role Filter */}
      <Select value={selectedRole} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value={UserRole.User}>User</SelectItem>
          <SelectItem value={UserRole.CS}>Customer Service</SelectItem>
          <SelectItem value={UserRole.Admin}>Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Blocked">Blocked</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}