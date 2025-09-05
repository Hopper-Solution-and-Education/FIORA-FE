import SelectField from '@/components/common/forms/select/SelectField';
import { useCurrencyFormatter } from '@/shared/hooks';
import React, { useMemo } from 'react';
import { FieldError } from 'react-hook-form';

interface CurrencySelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { exchangeRates } = useCurrencyFormatter();
  // Generate options from fetched data or fallback to default
  const options = useMemo(() => {
    if (Object.keys(exchangeRates).length > 0) {
      // Map the fetched data to the expected format using the correct API structure
      return Object.keys(exchangeRates)
        .filter((currency) => currency !== 'FX')
        .map((currency) => ({
          value: currency, // Use 'name' field (USD, VND, FX)
          label: `${currency} (${exchangeRates[currency].suffix})`, // Show both name and symbol
        }));
    }

    // Fallback to default options if data is not available
    return [{ value: 'none', label: 'No currencies available', disabled: true }];
  }, [exchangeRates]);

  return (
    <SelectField
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select currency"
      error={error}
      {...props}
    />
  );
};

export default CurrencySelect;
