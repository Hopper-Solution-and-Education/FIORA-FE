import { SelectField } from '@/components/common/forms';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DropdownOption } from '@/shared/types';
import { AppDispatch, RootState } from '@/store';
import { Product } from '@prisma/client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, retryFetchProducts } from '../../slices/createTransactionSlice';

interface ProductsSelectProps {
  name: string;
  // value?: string;
  // onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const ProductsSelectField: React.FC<ProductsSelectProps> = ({
  name,
  // value = '',
  // onChange,
  error,
  ...props
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { watch, setValue } = useFormContext();
  const selectedOption: string = watch('product') || '';

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  const {
    data: products,
    isLoading,
    error: fetchError,
    hasFetched,
  } = useSelector((state: RootState) => state.createTransaction.products);

  // Only fetch if we haven't attempted to fetch yet
  useEffect(() => {
    if (!hasFetched && !isLoading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, hasFetched, isLoading]);

  useEffect(() => {
    if (products.length > 0) {
      const tmpOptions: DropdownOption[] = [];

      products.forEach((product: Product) => {
        tmpOptions.push({
          value: product.id,
          label: product.name,
          icon: product.icon,
        });
      });
      setOptions(tmpOptions);
    } else if (hasFetched && !isLoading && !fetchError) {
      // If we've fetched but have no data and no error, show "No products available"
      setOptions([
        {
          label: 'No products available',
          value: 'none',
          disabled: true,
        },
      ]);
    } else if (!hasFetched && !isLoading) {
      // Initial state before fetching
      setOptions([
        {
          label: 'Select Product',
          value: 'none',
          disabled: true,
        },
      ]);
    }
  }, [products, hasFetched, isLoading, fetchError]);

  const handleChange = (selected: string) => {
    // Create an array with the selected value instead of spreading the string
    setValue('product', selected);
  };

  const handleRetry = () => {
    dispatch(retryFetchProducts());
    dispatch(fetchProducts());
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Product
          </FormLabel>
          <div className="w-full h-fit relative">
            {isLoading && (
              <div className="w-fit h-fit absolute top-[50%] right-[10%] -translate-y-[50%] z-10">
                <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
              </div>
            )}

            {fetchError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Failed to load products</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="h-6 px-2 text-red-700 hover:text-red-800"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            )}

            <SelectField
              className="w-full flex justify-between "
              name={name}
              disabled={isLoading}
              value={selectedOption ?? undefined}
              onChange={handleChange}
              options={options}
              placeholder={'Select Product'}
              error={error}
              {...props}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ProductsSelectField;
