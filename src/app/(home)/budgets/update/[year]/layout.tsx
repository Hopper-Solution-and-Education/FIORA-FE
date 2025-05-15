import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Update Budget',
  description: 'FIORA - Update Budget',
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
