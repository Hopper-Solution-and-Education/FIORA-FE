'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createExchangeRateSchema, ExchangeRateFormData } from '../schema';
import { ExchangeRateDeleteType, ExchangeRateObjectType, ExchangeRateType } from '../types';
import ConfirmUpdateModal from './ConfirmUpdateModal';
import DeleteExchangeRateDialog from './DeleteExchangeRateModal';

type ExchangeRateItemMode = 'new' | 'existing' | 'updating';

interface ExchangeRateItemProps {
  mode: ExchangeRateItemMode;
  rate?: ExchangeRateType;
  existingRates?: ExchangeRateType[];
  onSave: (rate: ExchangeRateObjectType) => void;
  onCancel: () => void;
  onEdit?: (updatedRate: ExchangeRateObjectType) => void;
  onEditStart?: () => void;
  onDelete?: (deletedRate: ExchangeRateDeleteType) => void;
  disabled?: boolean;
}

const ExchangeRateItem = (props: ExchangeRateItemProps) => {
  const {
    mode: initialMode,
    rate,
    existingRates = [],
    onSave,
    onCancel,
    onEdit,
    onEditStart,
    onDelete,
    disabled = false,
  } = props;

  const [currentMode, setCurrentMode] = useState<ExchangeRateItemMode>(initialMode);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateConfirmDialog, setOpenUpdateConfirmDialog] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<ExchangeRateObjectType | null>(null);
  const [isToValueEditing, setIsToValueEditing] = useState(false);

  const validationSchema = useMemo(() => {
    return createExchangeRateSchema(existingRates, rate?.id);
  }, [existingRates, rate?.id]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ExchangeRateFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      fromCurrency: 'USD',
      fromSymbol: '$',
      fromValue: 1,
      toCurrency: '',
      toSymbol: '',
      toValue: 0,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  const hasChanges = useMemo(() => {
    if (currentMode !== 'updating' || !rate) return true;

    return (
      watchedValues.toCurrency !== rate.toCurrency ||
      watchedValues.toSymbol !== rate.toSymbol ||
      watchedValues.toValue !== rate.toValue
    );
  }, [watchedValues, rate, currentMode]);

  useEffect(() => {
    if (rate && (currentMode === 'existing' || currentMode === 'updating')) {
      reset({
        fromCurrency: 'USD',
        fromSymbol: '$',
        fromValue: 1,
        toCurrency: rate.toCurrency,
        toSymbol: rate.toSymbol,
        toValue: rate.toValue,
      });
    } else if (currentMode === 'new') {
      reset({
        fromCurrency: 'USD',
        fromSymbol: '$',
        fromValue: 1,
        toCurrency: '',
        toSymbol: '',
        toValue: 0,
      });
    }
  }, [currentMode, rate, reset]);

  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleEditClick = () => {
    onEditStart?.();
    setCurrentMode('updating');
  };

  const handleCancelEdit = () => {
    if (rate) {
      reset({
        fromCurrency: 'USD',
        fromSymbol: '$',
        fromValue: 1,
        toCurrency: rate.toCurrency,
        toSymbol: rate.toSymbol,
        toValue: rate.toValue,
      });
    }
    setCurrentMode('existing');
  };

  const onSubmit = (data: ExchangeRateFormData) => {
    if (currentMode === 'updating') {
      setPendingUpdateData(data);
      setOpenUpdateConfirmDialog(true);
    } else {
      onSave(data);
    }
  };

  const handleConfirmUpdate = () => {
    if (pendingUpdateData && onEdit) {
      onEdit(pendingUpdateData);
      setOpenUpdateConfirmDialog(false);
      setPendingUpdateData(null);
      setCurrentMode('existing');
    }
  };

  const handleCancelUpdate = () => {
    setOpenUpdateConfirmDialog(false);
    setPendingUpdateData(null);
  };

  const isEditable = currentMode === 'new' || currentMode === 'updating';

  const getContainerClass = () => {
    switch (currentMode) {
      case 'new':
        return 'grid grid-cols-8 gap-2 items-end bg-gray-50 p-3 rounded-lg border-2 border-dashed border-gray-300';
      case 'updating':
        return 'grid grid-cols-8 gap-2 items-end bg-blue-50 p-3 rounded-lg border-2 border-blue-300';
      default:
        return 'grid grid-cols-8 gap-2 items-end bg-blue-50 p-3 rounded-lg';
    }
  };

  const getInputClass = (hasError: boolean = false) => {
    const baseClass = 'text-center';
    const modeClass =
      currentMode === 'new' ? '' : `font-medium ${isEditable ? 'bg-white' : 'bg-blue-200'}`;
    const errorClass = hasError ? 'border-red-500 focus:border-red-500' : '';
    return `${baseClass} ${modeClass} ${errorClass}`.trim();
  };

  const getFieldId = (field: string) => {
    const prefix = currentMode === 'new' ? 'add' : rate?.id || 'unknown';
    return `${prefix}-${field}`;
  };

  return (
    <>
      <form data-test="exchange-rate-item" onSubmit={handleSubmit(onSubmit)}>
        <div className={getContainerClass()}>
          <div className="space-y-1">
            <Label
              htmlFor={getFieldId('from-currency')}
              className="text-xs font-medium text-gray-600"
            >
              From Currency
            </Label>
            {errors.fromCurrency && (
              <p className="text-xs text-red-500">{errors.fromCurrency.message}</p>
            )}
            <Input
              id={getFieldId('from-currency')}
              value="USD"
              readOnly
              className="text-center font-medium bg-gray-100"
              placeholder="From Currency"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor={getFieldId('from-symbol')}
              className="text-xs font-medium text-gray-600"
            >
              From Symbol
            </Label>
            {errors.fromSymbol && (
              <p className="text-xs text-red-500">{errors.fromSymbol.message}</p>
            )}
            <Input
              id={getFieldId('from-symbol')}
              value="$"
              readOnly
              className="text-center font-medium bg-gray-100"
              placeholder="From Symbol"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={getFieldId('from-value')} className="text-xs font-medium text-gray-600">
              From Value
            </Label>
            {errors.fromValue && <p className="text-xs text-red-500">{errors.fromValue.message}</p>}
            <Input
              id={getFieldId('from-value')}
              value="1"
              readOnly
              className="text-center font-medium bg-gray-100"
              placeholder="From Value"
            />
          </div>

          <div className="text-center text-xl font-bold self-center pt-6">=</div>

          <div className="space-y-1">
            <Label htmlFor={getFieldId('to-value')} className="text-xs font-medium text-gray-600">
              To Value
            </Label>
            {errors.toValue && <p className="text-xs text-red-500">{errors.toValue.message}</p>}
            <Controller
              name="toValue"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={getFieldId('to-value')}
                  value={
                    isToValueEditing
                      ? String(field.value || '')
                      : field.value && field.value > 0
                        ? field.value.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 9,
                          })
                        : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    const numValue = parseFloat(value) || 0;
                    field.onChange(numValue);
                  }}
                  onFocus={() => setIsToValueEditing(true)}
                  onBlur={() => setIsToValueEditing(false)}
                  readOnly={!isEditable}
                  className={getInputClass(!!errors.toValue)}
                  placeholder="To Value"
                  type="text"
                  inputMode="decimal"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor={getFieldId('to-symbol')} className="text-xs font-medium text-gray-600">
              To Symbol
            </Label>
            {errors.toSymbol && <p className="text-xs text-red-500">{errors.toSymbol.message}</p>}
            <Controller
              name="toSymbol"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={getFieldId('to-symbol')}
                  readOnly={!isEditable}
                  className={getInputClass(!!errors.toSymbol)}
                  placeholder="To Symbol"
                />
              )}
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor={getFieldId('to-currency')}
              className="text-xs font-medium text-gray-600"
            >
              To Currency
            </Label>
            {errors.toCurrency && (
              <p className="text-xs text-red-500">{errors.toCurrency.message}</p>
            )}
            <Controller
              name="toCurrency"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id={getFieldId('to-currency')}
                  readOnly={!isEditable}
                  className={getInputClass(!!errors.toCurrency)}
                  placeholder="To Currency"
                />
              )}
            />
          </div>

          <div className="flex gap-2 self-center pt-6">
            {currentMode === 'new' || currentMode === 'updating' ? (
              <>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="p-2 text-green-600 hover:text-green-700"
                  disabled={disabled || !isValid || !hasChanges}
                >
                  <Icons.check className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  onClick={currentMode === 'new' ? onCancel : handleCancelEdit}
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
                  type="button"
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  className="p-2"
                  disabled={disabled}
                >
                  <Icons.pencil className="w-4 h-4" />
                </Button>

                {rate?.toCurrency === 'VND' || rate?.toCurrency === 'FX' ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            type="button"
                            onClick={handleDeleteClick}
                            variant="outline"
                            size="sm"
                            className="p-2 text-red-500 hover:text-red-700"
                            disabled={
                              disabled || rate?.toCurrency === 'VND' || rate?.toCurrency === 'FX'
                            }
                          >
                            <Icons.close className="w-4 h-4" />
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Currency is already used for transactions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Button
                    type="button"
                    onClick={handleDeleteClick}
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-500 hover:text-red-700"
                    disabled={disabled || rate?.toCurrency === 'VND' || rate?.toCurrency === 'FX'}
                  >
                    <Icons.close className="w-4 h-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </form>

      <DeleteExchangeRateDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={() =>
          onDelete?.({
            fromCurrencyId: rate?.fromCurrencyId || '',
            toCurrencyId: rate?.toCurrencyId || '',
          })
        }
        data={rate}
        isDeleting={false}
      />
      <ConfirmUpdateModal
        open={openUpdateConfirmDialog}
        onClose={handleCancelUpdate}
        onUpdate={handleConfirmUpdate}
        data={pendingUpdateData || undefined}
        isUpdating={disabled}
      />
    </>
  );
};

export default ExchangeRateItem;
