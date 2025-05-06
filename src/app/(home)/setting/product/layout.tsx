import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Product and Services',
  description: 'FIORA - Product and Services',
};

export default async function DashboardProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
