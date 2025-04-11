'use client';

import GlobalFormV2 from '@/components/common/organisms/GlobalFormV2';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { DialogTitle } from '@radix-ui/react-dialog';
import { isEmpty } from 'lodash';
import { Check, CircleX, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { memo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import {
  CategoryProductCreateRequest,
  CategoryProductUpdateRequest,
} from '../../domain/entities/Category';
import { setIsOpenDialogAddCategory, setProductCategoryFormState } from '../../slices';
import { createCategoryProductAsyncThunk } from '../../slices/actions/createCategoryProductAsyncThunk';
import { deleteCategoryProductAsyncThunk } from '../../slices/actions/deleteCategoryProductAsyncThunk';
import { updateCategoryProductAsyncThunk } from '../../slices/actions/updateCategoryProductAsyncThunk';
import useProductCategoryFormConfig from '../config/ProductCategoryFormConfig';
import {
  CategoryProductFormValues,
  defaultCategoryProductValue,
} from '../schema/productCategory.schema';

const ProductCategoryForm = () => {
  const dispatch = useAppDispatch();
  const fields = useProductCategoryFormConfig();
  const { data: userData } = useSession();
  const ProductCategoryFormState = useAppSelector(
    (state) => state.productManagement.ProductCategoryFormState,
  );
  const productCategories = useAppSelector(
    (state) => state.productManagement.productTransaction.data,
  );
  const isUpdatingCategoryProduct = useAppSelector(
    (state) => state.productManagement.isUpdatingProductCategory,
  );
  const isCreatingCategoryProduct = useAppSelector(
    (state) => state.productManagement.isCreatingProductCategory,
  );

  // Method of product category product
  const methods = useFormContext<CategoryProductFormValues>();
  const { handleSubmit, formState, getValues } = methods;

  const isButtonDisabled = !formState.isValid || formState.isSubmitting || formState.isValidating;

  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);

  // Handle Delete Category
  const handlePressDeleteCategory = () => {
    const categoryId = getValues('id') ?? '';
    const categoryItem = productCategories.find((item) => item.category.id === categoryId);
    if (isEmpty(categoryItem?.products)) {
      dispatch(deleteCategoryProductAsyncThunk({ productCategoryId: getValues('id') ?? '' }))
        .unwrap()
        .then(() => {
          dispatch(setIsOpenDialogAddCategory(false));
          dispatch(setProductCategoryFormState('add'));
        });
    } else {
      toast.error('Cannot delete category', {
        description: 'This category contains products. Please remove them first.',
      });
      setIsOpenDialogDelete(false);
    }
  };

  const handleCloseDialog = () => {
    dispatch(setIsOpenDialogAddCategory(false));
    methods.reset(defaultCategoryProductValue);
  };

  console.log(formState.isSubmitting);

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
    } catch (error) {
      console.error('Error :', error);
      toast.error('Failed');
    }
  };

  const footerButtonGroup = () => (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        {/* Cancel Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={ProductCategoryFormState === 'add'}
              onClick={() => setIsOpenDialogDelete(true)}
              variant="outline"
              type="button"
              className="flex items-center justify-center gap-2 px-10 py-2 border rounded-lg transition hover:bg-gray-100"
            >
              <Icons.trash className=" text-red-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>

        {/* Submit Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="flex items-center justify-center gap-2 px-10 py-2 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {formState.isSubmitting || isUpdatingCategoryProduct || isCreatingCategoryProduct ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{formState.isSubmitting ? 'Submitting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <GlobalFormV2
        methods={methods}
        fields={fields}
        onBack={() => dispatch(setIsOpenDialogAddCategory(false))}
        renderSubmitButton={footerButtonGroup}
      />
      <Dialog open={isOpenDialogDelete} onOpenChange={setIsOpenDialogDelete}>
        <DialogContent className="sm:max-w-md flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-between mt-auto">
            {/* Added flex and mt-auto */}
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              <CircleX />
            </Button>
            <Button onClick={handlePressDeleteCategory} type="button" variant="destructive">
              <Icons.check />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default memo(ProductCategoryForm);
