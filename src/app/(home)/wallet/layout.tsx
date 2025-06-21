import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Wallet',
  description: 'FIORA Wallet Dashboard',
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
