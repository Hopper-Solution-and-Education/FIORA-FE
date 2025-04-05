import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import useDataFetcher from '@/hooks/useDataFetcher';
import { Product } from '@prisma/client';
import React, { useEffect } from 'react';
import { FieldError } from 'react-hook-form';
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
  const [options, setOptions] = React.useState<DropdownOption[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const { data } = useDataFetcher<any>({
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

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Products
          </FormLabel>
          <div className="w-full">
            <div className="space-y-2">
              <MultiSelect
                options={options}
                selected={selectedOptions}
                onChange={setSelectedOptions}
                placeholder="Select products"
                className="w-full"
              />
              {error && <p className="text-sm text-red-500">{error.message}</p>}
            </div>
            {/* <SelectField
              className="px-4 py-2"
              name={name}
              value={value}
              onChange={(value) =>
                onChange(transactionType === 'Income' ? 'fromCategoryId' : 'fromAccountId', value)
              }
              options={options}
              placeholder={transactionType === 'Income' ? 'Select Category' : 'Select Account'}
              error={error}
              {...props}
            /> */}
          </div>
        </FormItem>
      )}
    />
  );
};

export default ProductsSelectField;
