import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Landing Settings',
  description: 'FIORA - Landing Settings',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <ModuleAccessLayout requiredRoles={['ADMIN']}>{children}</ModuleAccessLayout>;
}
