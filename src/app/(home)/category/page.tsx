'use client';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';

const CategoryDashboardRender = dynamic(
  () => import('@/features/home/module/category/CategoryDashboard'),
  {
    loading: () => <Loading />,
  },
);

const CategoryPage = () => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.CATEGORY_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <CategoryDashboardRender />;
};

export default CategoryPage;
