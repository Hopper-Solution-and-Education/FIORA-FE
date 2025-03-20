'use client';

import growthbook from '@/config/growthbook';
import { GrowthBookProvider } from '@growthbook/growthbook-react';

export function GrowthBookAppProvider({ children }: { children: React.ReactNode }) {
  return <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>;
}
