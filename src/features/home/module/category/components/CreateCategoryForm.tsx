'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GlobalIconSelect from '@/components/common/atoms/GlobalIconSelect';
import InputField from '@/components/common/atoms/InputField';
import TextareaField from '@/components/common/atoms/TextareaField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { Button } from '@/components/ui/button';
import ParentCategorySelectUpdate from '@/features/home/module/category/components/ParentCategorySelectUpdate';
import TypeSelect from '@/features/home/module/category/components/TypeSelect';
import { createCategory } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import {
  defaultNewCategoryValues,
  NewCategoryDefaultValues,
  validateNewCategorySchema,
} from '@/features/home/module/category/slices/utils/formSchema';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Icons } from '@/components/Icon';

interface CreateCategoryFormProps {
  initialData?: NewCategoryDefaultValues;
}

export default function CreateCategoryForm({ initialData }: CreateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  const parentOptions =
    categories.data?.map((category: Category) => ({
      value: category.id,
      label: category.name,
      type: category.type,
    })) || [];

  const fields = [
    <GlobalIconSelect key="icon" name="icon" />,
    <InputField key="name" name="name" placeholder="Category Name" />,
    <ParentCategorySelectUpdate key="parentId" name="parentId" options={parentOptions} />,
    <TypeSelect key="type" name="type" />,
    <TextareaField key="description" name="description" placeholder="Category description" />,
  ];

  const onSubmit = async (data: any) => {
    try {
      const payload: NewCategoryDefaultValues = {
        ...defaultNewCategoryValues,
        ...data,
      };
      await dispatch(createCategory(payload)).unwrap();
      toast.success('Category created successfully');
      router.push('/home/category');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  return (
    <GlobalForm
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={initialData || defaultNewCategoryValues}
      schema={validateNewCategorySchema}
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
  );
}
