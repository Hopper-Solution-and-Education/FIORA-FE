'use client';

import GlobalFormV2 from '@/components/common/organisms/GlobalFormV2';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CategoryProductCreateRequest,
  CategoryProductUpdateRequest,
} from '../../domain/entities/Category';
import { setIsOpenDialogAddCategory } from '../../slices';
import { createCategoryProductAsyncThunk } from '../../slices/actions/createCategoryProductAsyncThunk';
import { updateCategoryProductAsyncThunk } from '../../slices/actions/updateCategoryProductAsyncThunk';
import useProductCategoryFormConfig from '../config/ProductCategoryFormConfig';
import { CategoryProductFormValues } from '../schema/productCategory.schema';

export default function ProductCategoryForm() {
  const dispatch = useAppDispatch();
  const fields = useProductCategoryFormConfig();
  const ProductCategoryFormState = useAppSelector(
    (state) => state.productManagement.ProductCategoryFormState,
  );
  const methods = useFormContext<CategoryProductFormValues>();
  const { handleSubmit } = methods;

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
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
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
          createdAt: new Date().toString(),
          updatedAt: new Date().toString(),
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
      toast.error('Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <GlobalFormV2
        methods={methods}
        fields={fields}
        onBack={() => dispatch(setIsOpenDialogAddCategory(false))}
      />
    </form>
  );
}
