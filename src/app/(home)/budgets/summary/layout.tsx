import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

interface BudgetsSumaryLayoutProps {
  children: React.ReactNode;
}

export default function BudgetsSumaryLayout({ children }: BudgetsSumaryLayoutProps) {
  return (
    <section className="container mx-auto sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
