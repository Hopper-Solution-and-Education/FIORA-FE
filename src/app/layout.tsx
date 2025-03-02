'use client';
import { Inter } from 'next/font/google';
import './globals.css';

import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SWRConfig } from 'swr';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import { AmplitudeProvider } from '@/components/providers/AmplitudeContextProvider';
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SWRConfig value={swrOptions}>
          <NextTopLoader showSpinner={false} />
          <NuqsAdapter>
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
          </NuqsAdapter>
        </SWRConfig>
      </body>
    </html>
  );
}
