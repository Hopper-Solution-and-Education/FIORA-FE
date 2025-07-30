import SelectField from '@/components/common/forms/select/SelectField';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { AppDispatch, RootState } from '@/store';
import React, { useEffect, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrencies, retryFetchCurrencies } from '../../slices/createTransactionSlice';

interface TypeSelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const TypeSelectField: React.FC<TypeSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { watch } = useFormContext();
  const isTypeDisabled = watch('isTypeDisabled') || false;

  // Get currencies state from Redux
  const {
    data: currencies,
    isLoading: isLoadingCurrencies,
    error: fetchError,
    hasFetched,
  } = useSelector((state: RootState) => state.createTransaction.currencies);

  // Fetch currencies if not already fetched
  useEffect(() => {
    if (!hasFetched && !isLoadingCurrencies) {
      dispatch(fetchCurrencies());
    }
  }, [dispatch, hasFetched, isLoadingCurrencies]);

  // Generate options from fetched data or fallback to default
  const options = useMemo(() => {
    if (currencies.length > 0) {
      // Map the fetched data to the expected format using the correct API structure
      return currencies
        .filter((currency) => currency.name !== 'FX')
        .map((currency) => ({
          value: currency.name, // Use 'name' field (USD, VND, FX)
          label: `${currency.name} (${currency.symbol})`, // Show both name and symbol
        }));
    }

    // Fallback to default options if data is not available
    return [{ value: 'none', label: 'No currencies available', disabled: true }];
  }, [currencies]);

  const handleRetry = () => {
    dispatch(retryFetchCurrencies());
    dispatch(fetchCurrencies());
  };

  return (
    <FormField
      name="currency"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Currency <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="w-full flex flex-col justify-start items-start">
              <SelectField
                className="w-full flex justify-between"
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                placeholder={
                  isLoadingCurrencies
                    ? 'Loading currencies...'
                    : fetchError
                      ? 'Error loading currencies - Click to retry'
                      : 'Select currency'
                }
                disabled={isTypeDisabled || isLoadingCurrencies}
                error={error}
                noneValue={false}
                onClick={fetchError ? handleRetry : undefined}
                {...props}
              />
              {fetchError && !isLoadingCurrencies && (
                <p className="text-sm text-red-500 mt-1">
                  Failed to load currencies.{' '}
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="underline hover:no-underline"
                  >
                    Click to retry
                  </button>
                </p>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TypeSelectField;
