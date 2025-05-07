import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Budgets Control | Creation',
  description: 'FIORA Budgets Control',
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
