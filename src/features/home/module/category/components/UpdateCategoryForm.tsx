'use client';

import GlobalIconSelect from '@/components/common/forms/select/GlobalIconSelect';
import InputField from '@/components/common/forms/input/InputField';
import TextareaField from '@/components/common/forms/text-area/TextareaField';
import GlobalForm from '@/components/common/forms/GlobalForm';
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
import { Response } from '@/shared/types/Common.types';

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

  const getParentInfo = (field: string) => {
    if (initialData && initialData.parentId) {
      const findParent = categories.data?.find((category) => category.id === initialData.parentId);
      if (findParent) {
        switch (field) {
          case 'parentName':
            return findParent.name || '';
          case 'parentType':
            return findParent.type || CategoryType.Expense;
          default:
            return '';
        }
      }
    }
    return field === 'parentType' ? CategoryType.Expense : '';
  };

  const fields = [
    <GlobalIconSelect
      key="icon"
      name="icon"
      label={<GlobalLabel text="Icon" htmlFor="icon" required />}
    />,
    <InputField key="name" name="name" placeholder="Input Name" label="Name" required />,
    <ParentCategorySelectUpdate
      key="parentId"
      name="parentId"
      options={parentOptions}
      disabled={true}
      label="Parent"
    />,
    <TypeSelect key="type" name="type" label="Type" required disabled={true} />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Input description"
    />,
  ];

  const defaultValues = initialData
    ? {
        name: initialData.name || '',
        type: initialData.type || CategoryType.Expense,
        icon: initialData.icon || '',
        description: initialData.description || '',
        parentId: initialData.parentId || null,
        parentName: getParentInfo('parentName'),
        parentType: getParentInfo('parentType') as CategoryType,
        isTypeDisabled: true,
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
        parentName: data.parentName,
        parentType: data.parentType,
        isTypeDisabled: data.isTypeDisabled ?? false,
      };
      await dispatch(updateCategory(updatedCategory))
        .unwrap()
        .then((value: Response<Category>) => {
          if (value.status == 200) {
            router.push('/category');
            toast.success('You have edit Finance Category successfully!');
          }
        });
    } catch (error) {
      console.error('Error updating category:', error);
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
        />
      </div>
      <DeleteDialog />
    </>
  );
}
