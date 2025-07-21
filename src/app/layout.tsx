'use client';

import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import { AmplitudeProvider, ReduxProvider, ThemeProvider } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import growthbook from '@/config/growthbook/growthbook';
import { swrOptions } from '@/config/swr/swrConfig';
import { SectionTypeEnum } from '@/features/landing/constants';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import Updater from '@/store/Updater';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import 'reflect-metadata';
import { SWRConfig } from 'swr';
import './globals.css';

const defaultIconHeader = 'https://static.thenounproject.com/png/2864213-200.png';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { section } = useGetSection(SectionTypeEnum.HEADER);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href={section?.medias[0]?.media_url ?? defaultIconHeader}
          className="rounded-full"
        />
      </head>
      <body className={inter.className}>
        <React.StrictMode>
          <SWRConfig value={swrOptions}>
            <NextTopLoader showSpinner={false} />
            <NuqsAdapter>
              <KBar>
                <AmplitudeProvider>
                  <ReduxProvider>
                    <GrowthBookProvider growthbook={growthbook}>
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                      >
                        <SessionProvider>
                          <Toaster />
                          <Updater />

                          <main>{children}</main>
                          <SessionTimeoutModal />
                        </SessionProvider>
                      </ThemeProvider>
                    </GrowthBookProvider>
                  </ReduxProvider>
                </AmplitudeProvider>
              </KBar>
            </NuqsAdapter>
          </SWRConfig>
        </React.StrictMode>
      </body>
    </html>
  );
}
