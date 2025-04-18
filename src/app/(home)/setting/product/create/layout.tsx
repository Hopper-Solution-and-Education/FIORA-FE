import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product and Services - Create',
  description: 'Basic Fiora dashboard with Next.js and Shadcn',
};

export default async function CreateProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
