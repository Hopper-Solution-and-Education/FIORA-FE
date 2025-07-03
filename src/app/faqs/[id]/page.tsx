'use client';

import { useParams } from 'next/navigation';
import FaqDetailView from '@/features/faq/presentation/organisms/FaqDetailView';
export default function FQLDetailLayout() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <main>
      <FaqDetailView id={id} />
    </main>
  );
}
