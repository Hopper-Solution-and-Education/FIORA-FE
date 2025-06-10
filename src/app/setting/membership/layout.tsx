import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Membership Settings',
  description: 'FIORA - Membership Settings',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
