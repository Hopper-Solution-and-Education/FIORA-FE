import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Sign Up',
  description: 'FIORA - Sign Up',
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
