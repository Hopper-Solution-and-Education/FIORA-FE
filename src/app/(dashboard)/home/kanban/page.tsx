'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const KanbanPage = dynamic(() => import('@/features/home/module/kanban/KanbanPage'), {
  loading: () => <Loading />,
});

const page = () => {
  return <KanbanPage />;
};

export default page;
