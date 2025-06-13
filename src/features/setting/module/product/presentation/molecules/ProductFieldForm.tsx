'use client';

import { useFormContext } from 'react-hook-form';

import { FormConfig } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import useProductFormConfig from '../config/ProductFormConfig';
import { type ProductFormValues } from '../schema';

const ProductForm = () => {
  const router = useRouter();
  const method = useFormContext<ProductFormValues>();
  const productDetail = useAppSelector((state) => state.productManagement.productDetail);

  const {
    formState: { isValid, isSubmitting },
  } = method;

  const isUpdatingProduct = useAppSelector((state) => state.productManagement.isUpdatingProduct);
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);

  const fields = useProductFormConfig();

  const renderSubmitButtonDefault = () => (
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
              disabled={!isValid || isCreatingProduct || isUpdatingProduct}
              className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting ? (
                <Icons.spinner className="animate-spin h-5 w-5" />
              ) : (
                <Icons.check className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSubmitting ? 'Submiting...' : 'Submit'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  return (
    <>
      <div className="mx-auto">
        <div className="space-y-4">
          <FormConfig
            fields={fields}
            methods={method}
            renderSubmitButton={renderSubmitButtonDefault}
            createdAt={productDetail?.createdAt}
            updatedAt={productDetail?.updatedAt}
            createdBy={productDetail?.createdBy}
            updatedBy={productDetail?.updatedBy}
          />
        </div>
      </div>
    </>
  );
};

export default ProductForm;
