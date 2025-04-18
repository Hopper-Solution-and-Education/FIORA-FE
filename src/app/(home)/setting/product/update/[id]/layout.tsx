import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product and Services - Update',
  description: 'Basic Fiora dashboard with Next.js and Shadcn',
};

export default async function UpdateProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
