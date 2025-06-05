import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Landing Settings',
  description: 'FIORA - Landing Settings',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
