import Loading from '@/components/common/Loading';
import growthbook from '@/config/growthbook';
import { configureServerSideGrowthBook } from '@/config/growthbookServer';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';

const CategoryDashboardRender = dynamic(
  () => import('@/features/home/module/category/CategoryDashboard'),
  {
    loading: () => <Loading />,
  },
);
configureServerSideGrowthBook();
const gb = growthbook;
const categoryFeature = gb.isOn(FeatureFlags.CATEGORY_FEATURE);

const CategoryPage = () => {
  return categoryFeature && <CategoryDashboardRender />;
};

export default CategoryPage;
