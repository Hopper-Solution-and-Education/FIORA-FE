/* eslint-disable react-hooks/exhaustive-deps */
import { SelectField } from '@/components/common/forms';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { DropdownOption } from '@/shared/types';
import { Product } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

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
  const { watch, setValue } = useFormContext();
  const selectedOption: string = watch('product') || '';

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  const { data, isLoading, isValidating } = useDataFetcher<any>({
    endpoint: `/api/products`,
    method: 'GET',
  });

  useEffect(() => {
    if (data) {
      const tmpOptions: DropdownOption[] = [];
      const fetchedData = data.data.data || [];

      if (fetchedData.length > 0) {
        fetchedData.forEach((product: Product) => {
          tmpOptions.push({
            value: product.id,
            label: product.name,
            icon: product.icon,
          });
        });
      }
      setOptions(tmpOptions);
    } else {
      options.push({
        label: 'Select Product',
        value: 'none',
        disabled: true,
      });
    }
  }, [data]);

  const handleChange = (selected: string) => {
    // Create an array with the selected value instead of spreading the string
    setValue('product', selected);
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
            {(isLoading || isValidating) && (
              <div className="w-fit h-fit absolute top-[50%] right-[10%] -translate-y-[50%] z-10">
                <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
              </div>
            )}

            <SelectField
              className="w-full flex justify-between "
              name={name}
              disabled={isLoading || isValidating}
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
