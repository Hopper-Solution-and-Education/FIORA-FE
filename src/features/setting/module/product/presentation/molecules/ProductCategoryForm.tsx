'use client';

import GlobalForm from '@/components/common/organisms/GlobalForm';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import {
  CategoryProductCreateRequest,
  CategoryProductUpdateRequest,
} from '../../domain/entities/Category';
import { setIsOpenDialogAddCategory } from '../../slices';
import { createCategoryProductAsyncThunk } from '../../slices/actions/createCategoryProductAsyncThunk';
import useProductCategoryFormConfig from '../config/ProductCategoryFormConfig';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
} from '../schema/productCategory.schema';
import { updateCategoryProductAsyncThunk } from '../../slices/actions/updateCategoryProductAsyncThunk';

interface CreateCategoryFormProps {
  initialData?: CategoryProductFormValues;
}

export default function ProductCategoryForm({ initialData }: CreateCategoryFormProps) {
  const dispatch = useAppDispatch();
  const fields = useProductCategoryFormConfig();
  const ProductCategoryFormState = useAppSelector(
    (state) => state.productManagement.ProductCategoryFormState,
  );
  const { data: userData } = useSession();

  const onSubmit = async (data: CategoryProductFormValues) => {
    try {
      if (ProductCategoryFormState === 'add') {
        const requestParams: CategoryProductCreateRequest = {
          userId: userData?.user.id || '',
          icon: data.icon,
          name: data.name,
          description: data.description ?? null,
          taxRate: data.tax_rate,
        };

        dispatch(createCategoryProductAsyncThunk(requestParams))
          .unwrap()
          .then(() => {
            dispatch(setIsOpenDialogAddCategory(false));
          });
      } else if (ProductCategoryFormState === 'edit') {
        const requestParams: CategoryProductUpdateRequest = {
          id: data.id ?? '',
          userId: userData?.user.id ?? '',
          icon: data.icon,
          name: data.name,
          description: data.description ?? null,
          taxRate: data.tax_rate,
        };
        dispatch(updateCategoryProductAsyncThunk(requestParams))
          .unwrap()
          .then(() => {
            dispatch(setIsOpenDialogAddCategory(false));
          });
      }
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
