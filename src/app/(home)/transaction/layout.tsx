import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaction | Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

interface TransactionLayoutProps {
  children: React.ReactNode;
}

export default function TransactionLayout({ children }: TransactionLayoutProps) {
  return <section className="container mx-auto sm:px-6 lg:px-8">{children}</section>;
}
