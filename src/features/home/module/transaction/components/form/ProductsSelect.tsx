import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Product } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { DropdownOption } from '../../types';

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
  // ...props
}) => {
  const { watch, setValue } = useFormContext();
  const selectedOptions = watch('products') || [];

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  const { data, isLoading, isValidating } = useDataFetcher<any>({
    endpoint: '/api/products',
    method: 'GET',
  });

  useEffect(() => {
    if (data) {
      const tmpOptions: DropdownOption[] = [];

      if (data.data.data.length > 0) {
        data.data.data.forEach((product: Product) => {
          tmpOptions.push({
            value: product.id,
            label: product.name,
          });
        });
      } else {
        tmpOptions.push({
          label: 'Select Products',
          value: 'none',
          disabled: true,
        });
      }
      setOptions(tmpOptions);
    }
  }, [data]);

  const handleChange = (selected: string[]) => {
    setValue('products', selected);
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Products
          </FormLabel>
          <div className="w-full h-fit relative">
            {(isLoading || isValidating) && (
              <div className="w-fit h-fit absolute top-[50%] right-[10%] -translate-y-[25%] z-10">
                <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
              </div>
            )}
            <div className="space-y-2">
              <MultiSelect
                options={options}
                selected={selectedOptions}
                onChange={handleChange}
                placeholder="Select products"
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error.message}</p>}
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default ProductsSelectField;
