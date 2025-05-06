import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Create Product and Services',
  description: 'FIORA - Create Product and Services',
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
