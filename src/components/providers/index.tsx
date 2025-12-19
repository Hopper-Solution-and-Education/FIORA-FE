'use client';

import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import Updater from '@/components/providers/Updater';
import { Toaster } from '@/components/ui/sonner';
import growthbook from '@/config/growthbook/growthbook';
import { swrOptions } from '@/config/swr/swrConfig';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { TooltipProvider } from '../ui/tooltip';
import { AutoScrollTopProvider } from './AutoScrollTopProvider';
import { ReduxProvider } from './ReduxProvider';

const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={swrOptions}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <KBar>
            <ReduxProvider>
              <GrowthBookProvider growthbook={growthbook}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                  <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                  >
                    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
                      <TooltipProvider>
                        <AutoScrollTopProvider />
                        <Toaster />
                        <Updater />

                        {children}
                        <SessionTimeoutModal />
                      </TooltipProvider>
                    </SessionProvider>
                  </ThemeProvider>
                </GoogleOAuthProvider>
              </GrowthBookProvider>
            </ReduxProvider>
          </KBar>
        </NuqsAdapter>
      </SWRConfig>
    </QueryClientProvider>
  );
};

export default Providers;
