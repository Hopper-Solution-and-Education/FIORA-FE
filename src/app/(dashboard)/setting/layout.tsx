import { Metadata } from 'next';

import Hero from '@/components/common/molecules/Hero';
import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/features/setting/presentation/components/sidebar-nav';
import AuthLayout from '@/components/layouts/auth-layout';

export const metadata: Metadata = {
  title: 'Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

const sidebarNavItems = [
  {
    title: 'Partner',
    href: '/setting/partner',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthLayout requiresAuth={true}>
      <Hero />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 pt-8 pb-16 sm:pt-12">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Settings</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className="my-4 sm:my-6" />

          {/* Main Layout */}
          <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            {/* Sidebar */}
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>

            {/* Content */}
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}
