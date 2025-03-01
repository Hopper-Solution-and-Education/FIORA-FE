'use client';
import { Inter } from 'next/font/google';
import './globals.css';

import { SessionProvider } from 'next-auth/react';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ReduxProvider } from '@/store/provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
