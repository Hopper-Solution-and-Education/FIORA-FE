import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Transaction Detail',
  description: 'FIORA - Transaction Detail',
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
