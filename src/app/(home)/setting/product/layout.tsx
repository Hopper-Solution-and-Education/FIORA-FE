import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product and Services',
  description: 'Basic Fiora dashboard with Next.js and Shadcn',
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
