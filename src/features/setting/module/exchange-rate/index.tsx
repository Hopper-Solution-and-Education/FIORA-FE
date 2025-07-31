'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrencyFormatter } from '@/shared/hooks';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ExchangeRateItem from './presentation/components/ExchangeRateItem';
import ExchangeRateItemSkeleton from './presentation/components/ExchangeRateItemSkeleton';
import {
  ExchangeRateDeleteType,
  ExchangeRateObjectType,
  ExchangeRateType,
} from './presentation/types';

const DEFAULT_EXCHANGE_RATE: Partial<ExchangeRateType> = {
  fromCurrency: 'USD',
  fromSymbol: '$',
  fromValue: 1,
  toValue: 0,
  toSymbol: '',
  toCurrency: '',
};

const ExchangeRateSettingPage = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateType[]>([]);
  const { refreshExchangeRates } = useCurrencyFormatter();

  const { data, mutate, isLoading } = useDataFetch<ExchangeRateType[]>({
    endpoint: '/api/setting/currency-setting',
    method: 'GET',
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (data?.data) {
      setExchangeRates(data.data);
    }
  }, [data]);

  const handleAddRate = async (newRate: ExchangeRateObjectType) => {
    const response = await fetch(`/api/setting/currency-setting`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRate),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || 'Exchange rate added successfully');
      setIsAdding(false); // Close the create UI
      mutate(); // Refresh the data
    } else {
      toast.error(data.message || 'Failed to add exchange rate');
    }
  };

  const handleDeleteRate = async (deletedRate: ExchangeRateDeleteType) => {
    const response = await fetch(`/api/setting/currency-setting`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deletedRate),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success(data.message || 'Exchange rate deleted successfully');
      mutate();
    } else {
      toast.error(data.message || 'Failed to delete exchange rate');
    }
  };

  const handleEditRate = async (updatedRate: ExchangeRateObjectType) => {
    const response = await fetch('/api/setting/currency-setting', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRate),
    });
    const data = await response.json();
    if (response.ok) {
      refreshExchangeRates();
      toast.success(data.message || 'Exchange rate updated successfully');
      mutate();
    } else {
      toast.error(data.message || 'Failed to update exchange rate');
    }
  };

  const handleSaveEdit = (updatedRate: ExchangeRateObjectType) => {
    handleEditRate(updatedRate);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditStart = (rateId: string) => {
    setEditingId(rateId);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setEditingId(null);
    setIsAdding(true);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Exchange Rate Setting</CardTitle>
          <Button
            onClick={handleStartAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 p-0"
          >
            <Icons.add className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isAdding && (
              <ExchangeRateItem
                mode="new"
                onSave={handleAddRate}
                onCancel={handleCancelAdd}
                rate={DEFAULT_EXCHANGE_RATE as ExchangeRateType}
                existingRates={exchangeRates}
              />
            )}

            {isLoading && !exchangeRates.length ? (
              <ExchangeRateItemSkeleton count={3} />
            ) : (
              exchangeRates?.map((rate) => {
                const isEditing = editingId === rate.id;

                return (
                  <ExchangeRateItem
                    key={rate.id}
                    mode={isEditing ? 'updating' : 'existing'}
                    rate={rate}
                    existingRates={exchangeRates}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                    onEdit={handleEditRate}
                    onEditStart={() => handleEditStart(rate.id)}
                    onDelete={handleDeleteRate}
                    disabled={isAdding}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRateSettingPage;
