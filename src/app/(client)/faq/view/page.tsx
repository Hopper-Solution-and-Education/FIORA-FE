'use client';

import FaqDetailView from '@/features/faq/FaqDetail';
import SessionSidebar from '@/components/providers/SessionSidebar';

export default function FQLDetailLayout() {
  return (
    <SessionSidebar>
      <div>
        <div>
          <main>
            <FaqDetailView />
          </main>
        </div>
      </div>
    </SessionSidebar>
  );
}
