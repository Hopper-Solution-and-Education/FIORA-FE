'use client';

import { CommonTable } from '@/components/common/organisms';
import { CommonTableColumn } from '@/components/common/organisms/CommonTable/types';
import { Button } from '@/components/ui/button';
import { User } from '../../slices/type';
import UserAvatar from '../atoms/UserAvatar';

interface UserTableProps {
  users: User[];
  onUserAction?: (userId: string) => void;
}

export function UserTable({ users, onUserAction }: UserTableProps) {
  const totalUsers = users.length;

  const columns: CommonTableColumn<User>[] = [
    {
      key: 'profile',
      title: 'Profile',
      align: 'left',
      render: (user) => (
        <div className="flex items-center gap-2">
          <UserAvatar
            src={user.avatarUrl ? String(user.avatarUrl) : null}
            name={user.name}
            email={user.email}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      align: 'left',
      render: (user) => <span className="text-gray-600">{user.email}</span>,
    },
    {
      key: 'role',
      title: 'Role',
      align: 'left',
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
      align: 'left',
      render: (user) => <span className="text-gray-600">{user.creationDate}</span>,
    },
    {
      key: 'action',
      title: 'Action',
      align: 'left',
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

  return (
    <CommonTable<User>
      data={users}
      columns={columns}
      columnConfig={{}}
      leftHeaderNode={
        <div className="text-sm text-gray-600">
          Total users: <span className="font-semibold text-gray-800">{totalUsers}</span>
        </div>
      }
      loading={false}
      hasMore={false}
      isLoadingMore={false}
    />
  );
}
