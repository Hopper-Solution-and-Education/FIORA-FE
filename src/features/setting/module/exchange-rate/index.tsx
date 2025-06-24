import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import ExchangeRateItem from './presentation/components/ExchangeRateItem';

const DEFAULT_EXCHANGE_RATE: ExchangeRate = {
  id: '1',
  fromCurrency: 'USD',
  fromSymbol: '$',
  fromValue: '1',
  toValue: '',
  toSymbol: '',
  toCurrency: '',
};

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  fromSymbol: string;
  fromValue: string;
  toValue: string;
  toSymbol: string;
  toCurrency: string;
}

const ExchangeRateSettingPage = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([
    {
      id: '1',
      fromCurrency: 'USD',
      fromSymbol: '$',
      fromValue: '1',
      toValue: '1',
      toSymbol: 'FX',
      toCurrency: 'FIORA Coin',
    },
    {
      id: '2',
      fromCurrency: 'USD',
      fromSymbol: '$',
      fromValue: '1',
      toValue: '25.000',
      toSymbol: 'đ',
      toCurrency: 'VND',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddRate = (newRate: Omit<ExchangeRate, 'id'>) => {
    // Add new rate at the beginning of the list
    setExchangeRates([{ ...newRate, id: Date.now().toString() }, ...exchangeRates]);
    setIsAdding(false);
  };

  const handleDeleteRate = (id: string) => {
    setExchangeRates(exchangeRates.filter((rate) => rate.id !== id));
  };

  const handleEditRate = (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = (updatedRate: Omit<ExchangeRate, 'id'>) => {
    if (editingId) {
      setExchangeRates(
        exchangeRates.map((rate) =>
          rate.id === editingId ? { ...updatedRate, id: editingId } : rate,
        ),
      );
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    // Cancel any ongoing edit when starting to add
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
            {/* Add New Rate Row - appears at the top when adding */}
            {isAdding && (
              <ExchangeRateItem
                mode="new"
                onSave={handleAddRate}
                onCancel={handleCancelAdd}
                rate={DEFAULT_EXCHANGE_RATE}
              />
            )}

            {/* Exchange Rates List */}
            {exchangeRates.map((rate) => {
              const isEditing = editingId === rate.id;

              return (
                <ExchangeRateItem
                  key={rate.id}
                  mode={isEditing ? 'updating' : 'existing'}
                  rate={rate}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  onEdit={() => handleEditRate(rate.id)}
                  onDelete={handleDeleteRate}
                  disabled={isAdding}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRateSettingPage;
