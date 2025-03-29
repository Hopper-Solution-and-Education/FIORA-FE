import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
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
