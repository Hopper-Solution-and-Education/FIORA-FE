import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Transactions',
  description: 'FIORA - Transactions',
};

interface TransactionLayoutProps {
  children: React.ReactNode;
}

export default function TransactionLayout({ children }: TransactionLayoutProps) {
  return <section className="container mx-auto sm:px-6 lg:px-8">{children}</section>;
}
