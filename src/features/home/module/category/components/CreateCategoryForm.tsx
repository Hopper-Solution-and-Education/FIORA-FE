// src/features/home/module/category/components/CreateCategoryForm.tsx
'use client';

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
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting...' : 'Create Category'}
        </Button>
      )}
    />
  );
}
