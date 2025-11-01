import { ScrollToTop } from '@/features/landing/presentation/atoms';
import { PropsWithChildren } from 'react';

export default function MainContent({ children }: PropsWithChildren) {
  return (
    <main
      id="app-content"
      className="overflow-y-auto overflow-x-hidden h-full min-h-0 relative z-[1]"
    >
      {children}

      <ScrollToTop />
    </main>
  );
}
