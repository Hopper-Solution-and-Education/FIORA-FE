'use client';

import { CommonTable } from '@/components/common/organisms';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { Button } from '@/components/ui/button';
import { useUserSession } from '@/features/profile/shared/hooks/useUserSession';
import { UserRole } from '@prisma/client';
import { ArrowDown, ArrowLeftRight, ArrowUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { FilterState, User } from '../../slices/type';
import UserAvatar from '../atoms/UserAvatar';
import UserEKYCStatusBadge from '../atoms/UserEKYCStatusBadge';
import { UserStatusBadge } from '../atoms/UserStatusBadge';
import UserManagementHeaderLeft from '../molecules/UserHeaderTopLeft';
import UserManagementHeaderRight from '../molecules/UserHeaderTopRight';

const SortArrowBtn = ({
  sortDirection,
  isActivated,
}: {
  sortDirection: 'asc' | 'desc';
  isActivated: boolean;
}) => {
  if (isActivated && sortDirection === 'asc') {
    return <ArrowUp className="h-4 w-4" />;
  }
  return <ArrowDown className="h-4 w-4" />;
};

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
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hoveringColumn, setHoveringColumn] = useState<string | null>(null);

  const totalUsers = users.length;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

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

  const sortedUsers = useMemo(() => {
    if (!sortKey) return users;

    return [...users].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortKey) {
        case 'profile':
          aValue = (a.name || a.email || '').toLowerCase();
          bValue = (b.name || b.email || '').toLowerCase();
          break;
        case 'role':
          aValue = a.role.toLowerCase();
          bValue = b.role.toLowerCase();
          break;
        case 'registrationDate':
          aValue = a.registrationDate;
          bValue = b.registrationDate;
          break;
        case 'kycSubmissionDate':
          aValue = a.eKYC?.[0]?.createdAt || '';
          bValue = b.eKYC?.[0]?.createdAt || '';
          break;
        case 'userStatus':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortKey, sortDirection]);

  const allColumns: CommonTableColumn<User>[] = [
    {
      key: 'profile',
      titleText: 'Profile',
      title: (
        <div
          className="flex items-center justify-start gap-2 cursor-pointer"
          onClick={() => handleSort('profile')}
          onMouseEnter={() => setHoveringColumn('profile')}
          onMouseLeave={() => setHoveringColumn(null)}
        >
          <span className={sortKey === 'profile' ? 'text-blue-500' : ''}>Profile</span>
          {(hoveringColumn === 'profile' || sortKey === 'profile') && (
            <SortArrowBtn sortDirection={sortDirection} isActivated={sortKey === 'profile'} />
          )}
        </div>
      ),
      align: 'left',
      width: '12%',
      render: (user) => (
        <div className="pl-1 py-3 truncate items-center">
          <UserAvatar
            src={user.avatarUrl ? String(user.avatarUrl) : null}
            user={user}
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
      titleText: 'Role',
      title: (
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleSort('role')}
          onMouseEnter={() => setHoveringColumn('role')}
          onMouseLeave={() => setHoveringColumn(null)}
        >
          <span className={sortKey === 'role' ? 'text-blue-500' : ''}>Role</span>
          {(hoveringColumn === 'role' || sortKey === 'role') && (
            <SortArrowBtn sortDirection={sortDirection} isActivated={sortKey === 'role'} />
          )}
        </div>
      ),
      align: 'center',
      width: '5%',
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
      titleText: 'Registration Date',
      title: (
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleSort('registrationDate')}
          onMouseEnter={() => setHoveringColumn('registrationDate')}
          onMouseLeave={() => setHoveringColumn(null)}
        >
          <span className={sortKey === 'registrationDate' ? 'text-blue-500' : ''}>
            Registration Date
          </span>
          {(hoveringColumn === 'registrationDate' || sortKey === 'registrationDate') && (
            <SortArrowBtn
              sortDirection={sortDirection}
              isActivated={sortKey === 'registrationDate'}
            />
          )}
        </div>
      ),
      align: 'center',
      width: '8%',
      render: (user) => <span className="text-gray-600">{user.registrationDate}</span>,
    },
    {
      key: 'kycSubmissionDate',
      titleText: 'KYC Submission Date',
      title: (
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleSort('kycSubmissionDate')}
          onMouseEnter={() => setHoveringColumn('kycSubmissionDate')}
          onMouseLeave={() => setHoveringColumn(null)}
        >
          <span className={sortKey === 'kycSubmissionDate' ? 'text-blue-500' : ''}>
            KYC Submission Date
          </span>
          {(hoveringColumn === 'kycSubmissionDate' || sortKey === 'kycSubmissionDate') && (
            <SortArrowBtn
              sortDirection={sortDirection}
              isActivated={sortKey === 'kycSubmissionDate'}
            />
          )}
        </div>
      ),
      align: 'center',
      width: '10%',
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
      width: '5%',
      render: (user) => {
        const latestEKYCStatus = user.eKYC && user.eKYC.length > 0 ? user.eKYC[0].status : null;
        const displayStatus = latestEKYCStatus || user.status;

        return <UserEKYCStatusBadge status={displayStatus} />;
      },
    },
    {
      key: 'userStatus',
      titleText: 'User Status',
      title: (
        <div
          className="flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => handleSort('userStatus')}
          onMouseEnter={() => setHoveringColumn('userStatus')}
          onMouseLeave={() => setHoveringColumn(null)}
        >
          <span className={sortKey === 'userStatus' ? 'text-blue-500' : ''}>User Status</span>
          {(hoveringColumn === 'userStatus' || sortKey === 'userStatus') && (
            <SortArrowBtn sortDirection={sortDirection} isActivated={sortKey === 'userStatus'} />
          )}
        </div>
      ),
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
  }, [isCS, sortKey, sortDirection, hoveringColumn]);

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
      data={sortedUsers}
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
          users={sortedUsers}
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
