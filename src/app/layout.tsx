'use client';
import { Inter } from 'next/font/google';
import './globals.css';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { swrOptions } from '@/lib/swrConfig';
import { AmplitudeProvider } from '@/providers/AmplitudeContextProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';

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
          <AmplitudeProvider>
            <ReduxProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SessionProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <SessionTimeoutModal />
                  </div>
                </SessionProvider>
              </ThemeProvider>
            </ReduxProvider>
          </AmplitudeProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
