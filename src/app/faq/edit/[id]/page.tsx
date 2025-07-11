'use client';

import EditFaqPage from '../../../../features/faq/presentation/EditFaqPage';

export default function Page({ params }: { params: { id: string } }) {
  return <EditFaqPage id={params.id} />;
}
