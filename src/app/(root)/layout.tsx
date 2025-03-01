import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hopper Solution and Education',
  description: 'Hopper Solution and Education Landing Page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
