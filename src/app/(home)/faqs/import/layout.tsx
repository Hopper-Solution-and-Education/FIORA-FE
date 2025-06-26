import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Import FAQ',
  description: 'FIORA - Import FAQ',
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
