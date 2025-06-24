import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  fromSymbol: string;
  fromValue: string;
  toValue: string;
  toSymbol: string;
  toCurrency: string;
}

type ExchangeRateItemMode = 'new' | 'existing' | 'updating';

interface ExchangeRateItemProps {
  mode: ExchangeRateItemMode;
  rate?: ExchangeRate;
  onSave: (rate: Omit<ExchangeRate, 'id'>) => void;
  onCancel: () => void;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
}

const ExchangeRateItem: React.FC<ExchangeRateItemProps> = ({
  mode,
  rate,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const [localRate, setLocalRate] = useState<Omit<ExchangeRate, 'id'>>({
    fromCurrency: '',
    fromSymbol: '',
    fromValue: '',
    toValue: '',
    toSymbol: '',
    toCurrency: '',
  });

  // Initialize local state based on mode and rate
  useEffect(() => {
    if (rate && (mode === 'existing' || mode === 'updating')) {
      setLocalRate({
        fromCurrency: rate.fromCurrency,
        fromSymbol: rate.fromSymbol,
        fromValue: rate.fromValue,
        toValue: rate.toValue,
        toSymbol: rate.toSymbol,
        toCurrency: rate.toCurrency,
      });
    } else if (mode === 'new') {
      // Use default values if provided, otherwise use empty strings
      setLocalRate({
        fromCurrency: rate?.fromCurrency || '',
        fromSymbol: rate?.fromSymbol || '',
        fromValue: rate?.fromValue || '',
        toValue: rate?.toValue || '',
        toSymbol: rate?.toSymbol || '',
        toCurrency: rate?.toCurrency || '',
      });
    }
  }, [mode, rate]);

  const handleSave = () => {
    // Validate that all required fields are filled
    const isValid =
      localRate.fromCurrency.trim() &&
      localRate.fromSymbol.trim() &&
      localRate.fromValue.trim() &&
      localRate.toValue.trim() &&
      localRate.toSymbol.trim() &&
      localRate.toCurrency.trim();

    if (isValid) {
      onSave(localRate);
    }
  };

  const handleFieldChange = (field: keyof Omit<ExchangeRate, 'id'>, value: string) => {
    setLocalRate((prev) => ({ ...prev, [field]: value }));
  };

  const isEditable = mode === 'new' || mode === 'updating';
  const displayRate = rate && mode === 'existing' ? rate : localRate;

  // Get styling based on mode
  const getContainerClass = () => {
    switch (mode) {
      case 'new':
        return 'grid grid-cols-8 gap-2 items-end bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300';
      case 'updating':
        return 'grid grid-cols-8 gap-2 items-end bg-blue-50 p-3 rounded-lg border-2 border-blue-300';
      default:
        return 'grid grid-cols-8 gap-2 items-end bg-blue-50 p-3 rounded-lg';
    }
  };

  const getInputClass = () => {
    if (mode === 'new') return 'text-center';
    return `text-center font-medium ${isEditable ? 'bg-white' : 'bg-blue-200'}`;
  };

  const getFieldId = (field: string) => {
    const prefix = mode === 'new' ? 'add' : rate?.id || 'unknown';
    return `${prefix}-${field}`;
  };

  return (
    <div className={getContainerClass()}>
      <div className="space-y-1">
        <Label htmlFor={getFieldId('from-currency')} className="text-xs font-medium text-gray-600">
          From Currency
        </Label>
        <Input
          id={getFieldId('from-currency')}
          value={displayRate.fromCurrency}
          onChange={
            isEditable ? (e) => handleFieldChange('fromCurrency', e.target.value) : undefined
          }
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="From Currency"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={getFieldId('from-symbol')} className="text-xs font-medium text-gray-600">
          From Symbol
        </Label>
        <Input
          id={getFieldId('from-symbol')}
          value={displayRate.fromSymbol}
          onChange={isEditable ? (e) => handleFieldChange('fromSymbol', e.target.value) : undefined}
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="From Symbol"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={getFieldId('from-value')} className="text-xs font-medium text-gray-600">
          From Value
        </Label>
        <Input
          id={getFieldId('from-value')}
          value={displayRate.fromValue}
          onChange={isEditable ? (e) => handleFieldChange('fromValue', e.target.value) : undefined}
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="From Value"
        />
      </div>

      <div className="text-center text-xl font-bold self-center pt-6">=</div>

      <div className="space-y-1">
        <Label htmlFor={getFieldId('to-value')} className="text-xs font-medium text-gray-600">
          To Value
        </Label>
        <Input
          id={getFieldId('to-value')}
          value={displayRate.toValue}
          onChange={isEditable ? (e) => handleFieldChange('toValue', e.target.value) : undefined}
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="To Value"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={getFieldId('to-symbol')} className="text-xs font-medium text-gray-600">
          To Symbol
        </Label>
        <Input
          id={getFieldId('to-symbol')}
          value={displayRate.toSymbol}
          onChange={isEditable ? (e) => handleFieldChange('toSymbol', e.target.value) : undefined}
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="To Symbol"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={getFieldId('to-currency')} className="text-xs font-medium text-gray-600">
          To Currency
        </Label>
        <Input
          id={getFieldId('to-currency')}
          value={displayRate.toCurrency}
          onChange={isEditable ? (e) => handleFieldChange('toCurrency', e.target.value) : undefined}
          readOnly={!isEditable}
          className={getInputClass()}
          placeholder="To Currency"
        />
      </div>

      <div className="flex gap-2 self-center pt-6">
        {mode === 'new' || mode === 'updating' ? (
          <>
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="p-2 text-green-600 hover:text-green-700"
              disabled={disabled}
            >
              <Icons.check className="w-4 h-4" />
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="p-2 text-red-500 hover:text-red-700"
              disabled={disabled}
            >
              <Icons.close className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="p-2"
              disabled={disabled}
            >
              <Icons.pencil className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete?.(rate!.id)}
              variant="outline"
              size="sm"
              className="p-2 text-red-500 hover:text-red-700"
              disabled={disabled}
            >
              <Icons.close className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExchangeRateItem;
