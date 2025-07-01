'use client';

import React from 'react';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import { Toaster } from '@/components/ui/sonner';
import { swrOptions } from '@/config/swr/swrConfig';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import { SectionType } from '@prisma/client';
import { SessionProvider } from 'next-auth/react';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import 'reflect-metadata';
import { SWRConfig } from 'swr';
import growthbook from '@/config/growthbook/growthbook';
import './globals.css';
import { AmplitudeProvider, ReduxProvider, ThemeProvider } from '@/components/providers';
import Updater from '@/store/Updater';

const defaultIconHeader = 'https://static.thenounproject.com/png/2864213-200.png';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { section } = useGetSection(SectionType.HEADER);

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
                          <Toaster
                            theme="light"
                            position="bottom-left"
                            richColors
                            duration={3000}
                            gap={10}
                            visibleToasts={2.5}
                            dir="ltr"
                            toastOptions={{
                              classNames: {
                                toast:
                                  'sonner-toast bg-white dark:bg-[hsl(var(--card))] text-[hsl(var(--foreground))] font-medium text-sm py-3 px-4',
                                success:
                                  'sonner-toast-success bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                                error:
                                  'sonner-toast-error bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
                                warning:
                                  'sonner-toast-warning bg-amber-50 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                                info: 'sonner-toast-info bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                                loading:
                                  'sonner-toast-loading bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                              },
                            }}
                          />

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
