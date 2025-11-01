'use client';

import { MainLayout } from '@/components/layouts';
import Providers from '@/components/providers';
import { initGrowthBook } from '@/config/growthbook/growthbook';
import { SectionTypeEnum } from '@/features/landing/constants';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import { cn } from '@/shared/utils';
import { Inter } from 'next/font/google';
import React, { useEffect } from 'react';
import 'reflect-metadata';
import './globals.css';

const defaultIconHeader = 'https://static.thenounproject.com/png/2864213-200.png';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { section } = useGetSection(SectionTypeEnum.HEADER);

  useEffect(() => {
    // Initialize GrowthBook when the component mounts
    initGrowthBook().catch((error) => {
      console.error('Failed to initialize GrowthBook:', error);
    });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href={section?.medias[0]?.media_url ?? defaultIconHeader}
          className="rounded-full"
        />
      </head>

      <body className={cn(inter.className, 'antialiased')}>
        <React.StrictMode>
          <Providers>
            <MainLayout>{children}</MainLayout>
          </Providers>
        </React.StrictMode>
      </body>
    </html>
  );
}
