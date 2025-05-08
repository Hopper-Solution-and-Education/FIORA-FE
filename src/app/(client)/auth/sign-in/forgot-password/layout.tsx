import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Forgot Password',
  description: 'FIORA - Forgot Password',
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
