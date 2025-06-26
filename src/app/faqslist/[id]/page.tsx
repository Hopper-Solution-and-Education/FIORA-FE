'use client';

import { useParams } from 'next/navigation';
import FaqDetailView from '@/features/faq/presentation/organisms/FaqDetailView';
import SessionSidebar from '@/components/providers/SessionSidebar';

export default function FQLDetailLayout() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <SessionSidebar>
      <div>
        <div>
          <main>
            <FaqDetailView id={id} />
          </main>
        </div>
      </div>
    </SessionSidebar>
  );
}
