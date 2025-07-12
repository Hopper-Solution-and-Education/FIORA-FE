import SelectField from '@/components/common/forms/select/SelectField';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DropdownOption } from '@/shared/types';
import { AppDispatch, RootState } from '@/store';
import { Partner } from '@prisma/client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartners, retryFetchPartners } from '../../slices/createTransactionSlice';

interface PartnerSelectProps {
  name: string;
  // value?: string;
  // onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const PartnerSelectField: React.FC<PartnerSelectProps> = ({
  name,
  // value = '',
  // onChange,
  error,
  ...props
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { watch, setValue } = useFormContext();
  const partnerId = watch('partnerId') || '';
  const selectedType = watch('type') || 'Expense';

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  const {
    data: partners,
    isLoading,
    error: fetchError,
    hasFetched,
  } = useSelector((state: RootState) => state.createTransaction.partners);

  // Only fetch if we haven't attempted to fetch yet
  useEffect(() => {
    if (!hasFetched && !isLoading) {
      dispatch(fetchPartners());
    }
  }, [dispatch, hasFetched, isLoading]);

  useEffect(() => {
    if (partners.length > 0) {
      const tmpOptions: DropdownOption[] = [];

      partners.forEach((partner: Partner) => {
        tmpOptions.push({
          value: partner.id,
          label: partner.name,
          icon: partner.logo ?? 'handshake',
        });
      });
      setOptions(tmpOptions);
    } else if (hasFetched && !isLoading && !fetchError) {
      // If we've fetched but have no data and no error, show "No partners available"
      setOptions([
        {
          label: 'No partners available',
          value: 'none',
          disabled: true,
        },
      ]);
    } else if (!hasFetched && !isLoading) {
      // Initial state before fetching
      setOptions([
        {
          label: 'Select Partner',
          value: 'none',
          disabled: true,
        },
      ]);
    }
  }, [partners, hasFetched, isLoading, fetchError]);

  const handleChange = (selected: string) => {
    setValue('partnerId', selected);
  };

  const handleRetry = () => {
    dispatch(retryFetchPartners());
    dispatch(fetchPartners());
  };

  if (selectedType === 'Transfer') {
    return null;
  }

  return (
    <FormField
      name="partnerId"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Partner
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
                  <span>Failed to load partners</span>
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
              value={partnerId}
              onChange={handleChange}
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
