'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const CategoryDashboardRender = dynamic(
  () => import('@/features/home/module/category/CategoryDashboard'),
  {
    loading: () => <Loading />,
  },
);

const CategoryPage = () => {
  return <CategoryDashboardRender />;
};

export default CategoryPage;
