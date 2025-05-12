import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Update Category',
  description: 'FIORA - Update Category',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
