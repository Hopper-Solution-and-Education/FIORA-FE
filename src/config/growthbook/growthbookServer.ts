// app/growthbookServer.ts
import { setPolyfills, configureCache } from '@growthbook/growthbook';

export function configureServerSideGrowthBook() {
  setPolyfills({
    fetch: (url: string, init: RequestInit) =>
      fetch(url, {
        ...init,
        next: {
          revalidate: 10,
          tags: ['growthbook'],
        },
        cache: 'no-store',
      }),
  });

  configureCache({
    disableCache: true,
  });
}
