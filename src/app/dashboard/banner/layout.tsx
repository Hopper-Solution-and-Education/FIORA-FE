import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fiora Banner Settings',
  description: 'Basic Fiora dashboard with Next.js and Shadcn',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
