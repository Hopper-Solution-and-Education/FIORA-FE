import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Create Account',
  description: 'FIORA - Create Account',
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
