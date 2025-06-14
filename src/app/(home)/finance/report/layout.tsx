import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Finance Report',
  description: 'FIORA - Finance Chart Report',
};

export default async function FinanceChartLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </>
  );
}
