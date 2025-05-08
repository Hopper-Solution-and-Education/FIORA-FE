import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Accounts',
  description: 'FIORA - Accounts',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <section className="p-4 md:px-6">{children}</section>;
}
