import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Budget Detail',
  description: 'FIORA - Budget Detail',
};

interface BudgetsDetailLayoutProps {
  children: React.ReactNode;
}

export default function BudgetsDetailLayout({ children }: BudgetsDetailLayoutProps) {
  return (
    <section className="container mx-auto sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
