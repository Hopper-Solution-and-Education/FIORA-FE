'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FormPage from '@/components/common/organisms/FormPage';
import UpdateCategoryForm from '@/features/home/module/category/components/UpdateCategoryForm';
import Loading from '@/components/common/atoms/Loading';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import { setDeleteConfirmOpen, setSelectedCategory } from '@/features/home/module/category/slices';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icon';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

export default function UpdateCategory() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.CATEGORY_FEATURE);

  const { categories } = useAppSelector((state) => state.category);
  const categoryId = params?.id as string;

  const handleDeleteClick = () => {
    if (!category) return;
    dispatch(setSelectedCategory(category));
    dispatch(setDeleteConfirmOpen(true));
  };

  const renderDeleteButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        let foundCategory: Category | undefined;

        if (categories?.data && categoryId) {
          foundCategory = categories.data.find((c) => c.id === categoryId);
        }

        if (!categories?.data && categoryId) {
          const response = await dispatch(fetchCategories()).unwrap();
          foundCategory = response.data.find((c) => c.id === categoryId);
        }

        if (!foundCategory) {
          router.push('/home/category');
          return;
        }

        setCategory(foundCategory);
      } catch (error) {
        console.error('Error fetching categories:', error);
        router.push('/home/category');
      }
    };

    fetchData();
  }, [categoryId, categories?.data, dispatch, router]);

  if (categories.isLoading || !isLoaded) {
    return <Loading />;
  }

  if (categories.error) {
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;
  }

  if (!category || !isFeatureOn) {
    return null;
  }

  return (
    <FormPage
      title={`Edit Category: ${category.name}`}
      FormComponent={UpdateCategoryForm}
      initialData={category}
      headerActions={renderDeleteButton}
    />
  );
}
