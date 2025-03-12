'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const KanbanPage = dynamic(() => import('@/features/dashboard/module/kanban/KanbanPage'), {
  loading: () => <Loading />,
});

const page = () => {
  return <KanbanPage />;
};

export default page;
