import { Metadata } from 'next';

import AuthLayout from '@/components/layouts/auth-layout';

export const metadata: Metadata = {
  title: 'Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <AuthLayout requiresAuth={true}>
      <section className="container mx-auto sm:px-6 lg:px-8">
        {/* Main Layout */}
        <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          {/* Content */}
          <div className="flex-1">{children}</div>
        </div>
      </section>
    </AuthLayout>
  );
}
