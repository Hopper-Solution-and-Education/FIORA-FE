import UserManagementPage from '@/features/setting/module/user-management/presentation/pages/UserManagementPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Management | FIORA',
  description: 'Manage users, roles, and permissions',
};

export default function Page() {
  return <UserManagementPage />;
}
