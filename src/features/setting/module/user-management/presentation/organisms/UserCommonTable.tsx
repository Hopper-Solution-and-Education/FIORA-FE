'use client';

import { CommonTable } from '@/components/common/organisms';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Button } from '@/components/ui/button';
import { useUserSession } from '@/features/profile/shared/hooks/useUserSession';
import { UserRole } from '@prisma/client';
import { ArrowLeftRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterState, User } from '../../slices/type';
import UserAvatar from '../atoms/UserAvatar';
import UserEKYCStatusBadge from '../atoms/UserEKYCStatusBadge';
import { UserStatusBadge } from '../atoms/UserStatusBadge';
import UserManagementHeaderLeft from '../molecules/UserHeaderTopLeft';
import UserManagementHeaderRight from '../molecules/UserHeaderTopRight';

interface UserTableProps {
  users: User[];
  onUserAction?: (userId: string) => void;
  searchQuery: string;
  filters: FilterState;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
  totalActive: number;
  totalBlocked: number;
  totalPending: number;
  hasMore: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  className?: string;
  loading?: boolean;
}

export function UserTable({
  users,
  onUserAction,
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
  totalActive,
  totalBlocked,
  totalPending,
  hasMore,
  onLoadMore,
  isLoadingMore,
  className,
  loading,
}: UserTableProps) {
  const { isCS } = useUserSession();

  const totalUsers = users.length;

  const getRoleClass = (role: string) => {
    switch (role) {
      case UserRole.Admin:
        return 'bg-red-100 text-red-800';
      case UserRole.CS:
        return 'bg-green-100 text-green-800';
      case UserRole.User:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const allColumns: CommonTableColumn<User>[] = [
    {
      key: 'profile',
      title: 'Profile',
      align: 'left',
      width: '14%',
      render: (user) => (
        <div className="pl-1 py-3 truncate items-center">
          <UserAvatar
            src={user.avatarUrl ? String(user.avatarUrl) : null}
            name={user.name}
            email={user.email}
            size="sm"
            showTooltip={true}
          />
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      align: 'center',
      width: '3%',
      render: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getRoleClass(user.role)} border-gray-200`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: 'registrationDate',
      title: 'Registration Date',
      align: 'center',
      width: '8%',
      render: (user) => <span className="text-gray-600">{user.registrationDate}</span>,
    },
    {
      key: 'kycSubmissionDate',
      title: 'KYC Submission Date',
      align: 'center',
      width: '8%',
      render: (user) => (
        <span className="text-gray-600">
          {user.eKYC?.[0]?.createdAt
            ? new Date(user.eKYC[0].createdAt).toLocaleDateString('en-GB')
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'KYC Status',
      align: 'center',
      width: '6%',
      render: (user) => {
        const latestEKYCStatus = user.eKYC && user.eKYC.length > 0 ? user.eKYC[0].status : null;
        const displayStatus = latestEKYCStatus || user.status;

        return <UserEKYCStatusBadge status={displayStatus} />;
      },
    },
    {
      key: 'userStatus',
      title: 'User Status',
      align: 'center',
      width: '6%',
      render: (user) => (
        <UserStatusBadge status={user.status === 'blocked' ? 'Blocked' : 'Active'} />
      ),
    },
    {
      key: 'action',
      title: 'Action',
      align: 'center',
      width: '5%',
      render: (user) => (
        <Button variant="ghost" size="sm" onClick={() => onUserAction?.(user.id)}>
          <ArrowLeftRight size={16} />
        </Button>
      ),
    },
  ];

  // Filter columns based on user role
  const columns = useMemo(() => {
    if (isCS) {
      // CS cannot see 'role' and 'userStatus' columns
      return allColumns.filter((col) => col.key !== 'role' && col.key !== 'userStatus');
    }
    return allColumns;
  }, [isCS, allColumns]);

  const initialConfig: ColumnConfigMap = useMemo(() => {
    return columns.reduce((acc, c, idx) => {
      if (c.key) {
        acc[c.key as string] = {
          isVisible: true,
          index: idx,
          alignOverride: c.align,
        };
      }
      return acc;
    }, {} as ColumnConfigMap);
  }, [columns]);

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(initialConfig);

  return (
    <CommonTable<User>
      data={users}
      columns={columns}
      columnConfig={columnConfig}
      onColumnConfigChange={setColumnConfig}
      storageKey="user-management-table"
      hasMore={hasMore}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
      loading={loading}
      className={className}
      leftHeaderNode={
        <UserManagementHeaderLeft
          searchQuery={searchQuery}
          filters={filters}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          users={users}
        />
      }
      rightHeaderNode={
        <UserManagementHeaderRight
          total={totalPending}
          current={totalUsers}
          totalActive={totalActive}
          totalBlocked={totalBlocked}
        />
      }
    />
  );
}
