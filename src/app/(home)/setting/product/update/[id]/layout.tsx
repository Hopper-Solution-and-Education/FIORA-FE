import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Update Product and Services',
  description: 'FIORA - Update Product and Services',
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
