'use client';

import GlobalForm from '@/components/common/organisms/GlobalForm';
import { useAppDispatch } from '@/store';
import { toast } from 'sonner';
import { setIsOpenDialogAddCategory } from '../../slices';
import useProductCategoryFormConfig from '../config/ProductCategoryFormConfig';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
} from '../schema/productCategory.schema';

interface CreateCategoryFormProps {
  initialData?: CategoryProductFormValues;
}

export default function ProductCategoryForm({ initialData }: CreateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const fields = useProductCategoryFormConfig();

  const onSubmit = async (data: CategoryProductFormValues) => {
    try {
      console.log(data);
    } catch (error) {
      console.error('Error :', error);
      toast.error('Failed ');
    }
  };

  return (
    <GlobalForm
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={initialData || defaultCategoryProductValue}
      schema={categoryProductsSchema}
      onBack={() => dispatch(setIsOpenDialogAddCategory(false))}
    />
  );
}
