import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Finance Chart',
  description: 'FIORA - Finance Chart',
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
