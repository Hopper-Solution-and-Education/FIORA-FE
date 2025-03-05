'use client';
import { Inter } from 'next/font/google';
import './globals.css';

import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import { AmplitudeProvider } from '@/components/providers/AmplitudeContextProvider';
import { GrowthBookAppProvider } from '@/components/providers/GrowthBookProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { swrOptions } from '@/lib/swrConfig';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // growthbook.init({ streaming: true });
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GrowthBookAppProvider>
          <SWRConfig value={swrOptions}>
            <NextTopLoader showSpinner={false} />
            <NuqsAdapter>
              <KBar>
                <AmplitudeProvider>
                  <ReduxProvider>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                      disableTransitionOnChange
                    >
                      <SessionProvider>
                        <Toaster />
                        <main>{children}</main>
                        <SessionTimeoutModal />
                      </SessionProvider>
                    </ThemeProvider>
                  </ReduxProvider>
                </AmplitudeProvider>
              </KBar>
            </NuqsAdapter>
          </SWRConfig>
        </GrowthBookAppProvider>
      </body>
    </html>
  );
}
