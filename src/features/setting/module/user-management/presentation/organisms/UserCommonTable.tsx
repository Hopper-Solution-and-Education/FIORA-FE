'use client';

import { CommonTable } from '@/components/common/organisms';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { FilterState, User } from '../../slices/type';
import UserAvatar from '../atoms/UserAvatar';
import UserEKYCStatusBadge from '../atoms/UserEKYCStatusBadge';
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
}: UserTableProps) {
  const totalUsers = users.length;

  const columns: CommonTableColumn<User>[] = [
    {
      key: 'profile',
      title: 'Profile',
      align: 'left',
      width: '12%',
      render: (user) => (
        <div className="flex items-center gap-2">
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
      key: 'email',
      title: 'Email',
      align: 'left',
      width: '15%',
      render: (user) => <span className="text-gray-600">{user.email}</span>,
    },
    {
      key: 'role',
      title: 'Role',
      align: 'center',
      width: '10%',
      render: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            user.role === 'CS' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: 'creationDate',
      title: 'Creation date',
      align: 'center',
      width: '12%',
      render: (user) => <span className="text-gray-600">{user.creationDate}</span>,
    },
    {
      key: 'kycSubmissionDate',
      title: 'KYC Submission Date',
      align: 'center',
      width: '12%',
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
      title: 'Status',
      align: 'center',
      width: '10%',
      render: (user) => {
        const latestEKYCStatus = user.eKYC && user.eKYC.length > 0 ? user.eKYC[0].status : null;
        const displayStatus = latestEKYCStatus || user.status;

        return <UserEKYCStatusBadge status={displayStatus} />;
      },
    },
    {
      key: 'action',
      title: 'Action',
      align: 'left',
      width: '10%',
      render: (user) => (
        <Button variant="ghost" size="sm" onClick={() => onUserAction?.(user.id)}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </Button>
      ),
    },
  ];

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
      className={className} // Add className for styling
      leftHeaderNode={
        <UserManagementHeaderLeft
          searchQuery={searchQuery}
          filters={filters}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
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
