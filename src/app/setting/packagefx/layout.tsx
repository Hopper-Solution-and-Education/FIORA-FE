import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FIORA | Package FX',
  description: 'FIORA - Package FX',
};
export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ModuleAccessLayout>{children}</ModuleAccessLayout>;
}
