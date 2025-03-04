import { Metadata } from 'next';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/features/setting/presentation/components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

const sidebarNavItems = [
  {
    title: 'Account',
    href: '/setting/account',
  },
  {
    title: 'Expense & Income',
    href: '/setting/expense-income',
  },
  {
    title: 'Product & Services',
    href: '/setting/product-services',
  },
  {
    title: 'Partners',
    href: '/setting/partners',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="hidden space-y-6 pt-16 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
