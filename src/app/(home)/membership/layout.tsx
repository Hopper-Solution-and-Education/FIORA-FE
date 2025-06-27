import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Membership',
  description: 'FIORA - Membership',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
