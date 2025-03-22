'use client';
import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import { AmplitudeProvider } from '@/components/providers/AmplitudeContextProvider';
import { GrowthBookAppProvider } from '@/components/providers/GrowthBookProvider';
import { ReduxProvider } from '@/components/providers/ReduxProvider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { swrOptions } from '@/config/swrConfig';
import { useGetSection } from '@/features/landing/hooks/useGetSection';
import { SectionType } from '@prisma/client';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
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
  const { section } = useGetSection(SectionType.HEADER);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={section?.medias[0].media_url ?? defaultIconHeader} />
      </head>
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
                        <Toaster
                          theme="light"
                          position="top-right"
                          richColors
                          duration={3000}
                          gap={10}
                          visibleToasts={3}
                          toastOptions={{
                            classNames: {
                              success: 'bg-green-600/90 text-white',
                              error: 'bg-red-600/90 text-white',
                              warning: 'bg-yellow-600/90 text-white',
                              info: 'bg-blue-600/90 text-white',
                            },
                          }}
                        />
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
