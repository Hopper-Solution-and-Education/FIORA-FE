import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Wallet Detail',
  description: 'FIORA - Wallet Detail',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Page main content */}
      {children}
      {/* Page main content ends */}
    </>
  );
}
