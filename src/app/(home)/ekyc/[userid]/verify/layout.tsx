import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Verify eKYC',
  description: 'FIORA - Verify eKYC',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <ModuleAccessLayout requiredRoles={['ADMIN', 'CS']}>{children}</ModuleAccessLayout>;
}
