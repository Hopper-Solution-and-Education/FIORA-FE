'use client';

import GlobalFormV2 from '@/components/common/organisms/GlobalFormV2';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import { Check, Loader2 } from 'lucide-react';
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
  const { handleSubmit, formState } = methods;

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

  const footerButtonGroup = () => (
    <TooltipProvider>
      <div className="flex justify-between gap-4 mt-6">
        {/* Cancel Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => dispatch(setIsOpenDialogAddCategory(false))}
              variant="outline"
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition hover:bg-gray-100"
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
              disabled={!formState.isValid || formState.isSubmitting || formState.isValidating}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {formState.isSubmitting ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              <span>{formState.isSubmitting ? 'Submitting...' : 'Submit'}</span>
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
    </form>
  );
}
