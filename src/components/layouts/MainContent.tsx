import { ScrollToTop } from '@/features/landing/presentation/atoms';

export default function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main id="app-content">
      {children}

      <ScrollToTop />
    </main>
  );
}
