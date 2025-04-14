'use client';

import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/organisms/FormPage';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UpdateCategoryForm from '@/features/home/module/category/components/UpdateCategoryForm';
import { useUpdateCategory } from '@/features/home/module/category/hooks/useUpdateCategory';
import { useParams } from 'next/navigation';

export default function UpdateCategory() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { category, isLoading, handleDelete } = useUpdateCategory(categoryId);

  const renderDeleteButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            type="button"
            onClick={handleDelete}
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

  if (isLoading) {
    return <Loading />;
  }

  if (!category) {
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
