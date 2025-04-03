import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { MOCK_ACCOUNTS, MOCK_CATEORIES } from '../../utils/constants';
import { DropdownOption } from '../../types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';

interface ProductsSelectProps {
  name: string;
  value?: string;
  onChange?: (target: 'fromAccountId' | 'fromCategoryId', value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const ProductsSelectField: React.FC<ProductsSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const transactionType = watch('type') || 'Expense';

  const [options, setOptions] = React.useState<DropdownOption[]>([]);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  useEffect(() => {
    setOptions(transactionType === 'Income' ? MOCK_CATEORIES : MOCK_ACCOUNTS);
  }, [transactionType]);

  return (
    <FormField
      name="from"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Products
          </FormLabel>
          <div className="w-full">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedOptions.map((optionValue) => {
                  const option = options.find((opt) => opt.value === optionValue);
                  return option ? (
                    <div
                      key={option.value}
                      className="bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1"
                    >
                      <span>{option.label}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOptions((prev) => prev.filter((item) => item !== option.value))
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              <Select
                value={value}
                onValueChange={(val) => {
                  setSelectedOptions((prev) => {
                    if (prev.includes(val)) {
                      return prev.filter((item) => item !== val);
                    } else {
                      return [...prev, val];
                    }
                  });
                  onChange(transactionType === 'Income' ? 'fromCategoryId' : 'fromAccountId', val);
                }}
                name={name}
                {...props}
              >
                <SelectTrigger
                  id={props.id}
                  className={cn(error ? 'border-red-500' : '', 'px-4 py-2')}
                  onClick={(e) => {
                    // This prevents the dropdown from closing when clicking on the trigger
                    e.preventDefault();
                  }}
                >
                  <SelectValue placeholder={'Select Products'} />
                </SelectTrigger>
                <SelectContent
                  onCloseAutoFocus={(e) => {
                    // Prevent the dropdown from closing after selection
                    e.preventDefault();
                  }}
                  // onInteractOutside={(e) => {
                  //   // Only close when clicking outside the dropdown
                  //   if (!e.target.closest('.select-content')) {
                  //     return;
                  //   }
                  //   e.preventDefault();
                  // }}
                >
                  <SelectGroup>
                    {options.map((option: DropdownOption) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        onSelect={(e) => {
                          // Prevent the default selection behavior
                          e.preventDefault();
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option.value)}
                            readOnly
                            className="mr-2"
                          />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
