import SelectField from '@/components/common/forms/select/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Partner } from '@prisma/client';
import React, { useEffect } from 'react';
import { FieldError } from 'react-hook-form';
import { DropdownOption } from '../../types';

interface PartnerSelectProps {
  name: string;
  value?: string;
  onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const PartnerSelectField: React.FC<PartnerSelectProps> = ({
  name,
  value = '',
  onChange,
  error,
  ...props
}) => {
  const [options, setOptions] = React.useState<DropdownOption[]>([]);
  const { data } = useDataFetcher<Partner[]>({
    endpoint: '/api/partners',
    method: 'GET',
  });

  useEffect(() => {
    if (data) {
      const tmpOptions: DropdownOption[] = [];

      if (data.data.length > 0) {
        data.data.forEach((partner: Partner) => {
          tmpOptions.push({
            value: partner.id,
            label: partner.name,
          });
        });
      } else {
        tmpOptions.push({
          label: 'Select',
          value: 'none',
          disabled: true,
        });
      }
      setOptions(tmpOptions);
    }
  }, [data]);

  return (
    <FormField
      name="partner"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Partner
          </FormLabel>
          <div className="w-full">
            <SelectField
              className="px-4 py-2"
              name={name}
              value={options.find((option) => option.value === value)?.label || 'Unknown'}
              onChange={onChange}
              options={options}
              placeholder={'Select Partner'}
              error={error}
              {...props}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default PartnerSelectField;
