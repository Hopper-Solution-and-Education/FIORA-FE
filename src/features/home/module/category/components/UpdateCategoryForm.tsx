'use client';

import GlobalIconSelect from '@/components/common/atoms/GlobalIconSelect';
import InputField from '@/components/common/atoms/InputField';
import TextareaField from '@/components/common/atoms/TextareaField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ParentCategorySelectUpdate from '@/features/home/module/category/components/ParentCategorySelectUpdate';
import TypeSelect from '@/features/home/module/category/components/TypeSelect';
import { updateCategory } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import {
  defaultUpdateCategoryValues,
  UpdateCategoryDefaultValues,
  validateUpdateCategorySchema,
} from '@/features/home/module/category/slices/utils/formSchema';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteDialog from './DeleteDialog';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';

interface UpdateCategoryFormProps {
  initialData?: Category;
}

export default function UpdateCategoryForm({ initialData }: UpdateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  const parentOptions =
    categories.data
      ?.filter((category: Category) => category.id !== initialData?.id && !category.parentId)
      .map((category: Category) => ({
        value: category.id,
        label: category.name,
        type: category.type,
      })) || [];

  const isParentDisabled = initialData?.parentId ? true : false;

  const fields = [
    <InputField
      key="name"
      name="name"
      placeholder="Category Name"
      label={<GlobalLabel text="Name" htmlFor="name" required />}
    />,
    <GlobalIconSelect
      key="icon"
      name="icon"
      label={<GlobalLabel text="Icon" htmlFor="icon" required />}
    />,
    <TypeSelect
      key="type"
      name="type"
      label={<GlobalLabel text="Type" required htmlFor="type" />}
    />,
    <ParentCategorySelectUpdate
      key="parentId"
      name="parentId"
      options={parentOptions}
      disabled={isParentDisabled}
      label="Parent"
    />,
    <TextareaField
      key="description"
      name="description"
      placeholder="Type your description here"
      label="Description"
    />,
  ];

  const defaultValues = initialData
    ? {
        name: initialData.name || '',
        type: initialData.type || CategoryType.Expense,
        icon: initialData.icon || '',
        description: initialData.description || '',
        parentId: initialData.parentId || null,
        isTypeDisabled: initialData.parentId ? true : false,
      }
    : defaultUpdateCategoryValues;

  const onSubmit = async (data: any) => {
    try {
      const updatedCategory: UpdateCategoryDefaultValues = {
        ...initialData,
        name: data.name,
        type: data.type,
        icon: data.icon,
        description: data.description ?? undefined,
        parentId: data.parentId,
        isTypeDisabled: data.isTypeDisabled ?? false,
      };
      await dispatch(updateCategory(updatedCategory)).unwrap();
      toast.success('Category updated successfully');
      router.push('/home/category');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <GlobalForm
          fields={fields}
          onSubmit={onSubmit}
          defaultValues={defaultValues}
          schema={validateUpdateCategorySchema}
          renderSubmitButton={(formState) => (
            <TooltipProvider>
              <div className="flex justify-between gap-4 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.back()}
                      className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                    >
                      <Icons.circleArrowLeft className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel and go back</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      disabled={formState.isSubmitting}
                      className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {formState.isSubmitting ? (
                        <Icons.spinner className="animate-spin h-5 w-5" />
                      ) : (
                        <Icons.check className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{formState.isSubmitting ? 'Saving...' : 'Save changes'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          )}
        />
      </div>
      <DeleteDialog />
    </>
  );
}
