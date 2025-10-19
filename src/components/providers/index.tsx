'use client';

import { SessionTimeoutModal } from '@/components/common/SessionTimeoutModal';
import KBar from '@/components/kbar';
import { Toaster } from '@/components/ui/sonner';
import growthbook from '@/config/growthbook/growthbook';
import { swrOptions } from '@/config/swr/swrConfig';
import { ScrollToTop } from '@/features/landing/presentation/atoms';
import Updater from '@/store/Updater';
import { GrowthBookProvider } from '@growthbook/growthbook-react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { PropsWithChildren } from 'react';
import { SWRConfig } from 'swr';
import { AmplitudeProvider } from './AmplitudeContextProvider';
import { ReduxProvider } from './ReduxProvider';

const Providers = ({ children }: PropsWithChildren) => {
  return (
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
                  <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
                    <Toaster />
                    <Updater />

                    {children}
                    <ScrollToTop />
                    <SessionTimeoutModal />
                  </SessionProvider>
                </ThemeProvider>
              </GrowthBookProvider>
            </ReduxProvider>
          </AmplitudeProvider>
        </KBar>
      </NuqsAdapter>
    </SWRConfig>
  );
};

export default Providers;
