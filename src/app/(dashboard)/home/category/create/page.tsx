'use client';
import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/organisms/FormPage';
import CreateCategoryForm from '@/features/home/module/category/components/CreateCategoryForm';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

export default function CreateCategory() {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.CATEGORY_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <FormPage title="Create New Category" FormComponent={CreateCategoryForm} />;
}
