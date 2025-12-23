import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { USER_ROLES } from '@/shared/constants';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'FIORA | User Management',
  description: 'FIORA - User Management',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.CS]}>
      {children}
    </ModuleAccessLayout>
  );
}
