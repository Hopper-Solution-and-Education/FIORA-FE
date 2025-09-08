'use client';

import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppSelector } from '@/store';
import React from 'react';
import type { PackageFX } from '../../domain/entity/PackageFX';

interface WalletDepositPackageCardProps {
  packageFX: PackageFX;
  selected?: boolean;
  onSelect?: (id: string) => void;
  isPopular?: boolean;
}

const WalletDepositPackageCard: React.FC<WalletDepositPackageCardProps> = ({
  packageFX,
  selected = false,
  onSelect,
  isPopular = false,
}) => {
  const currency = useAppSelector((state) => state.settings.currency);
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();

  const usdAmount = getExchangeAmount({
    fromCurrency: CURRENCY.FX,
    toCurrency: currency,
    amount: packageFX.fxAmount,
  }).convertedAmount;

  return (
    <Card
      className={`flex items-center gap-4 p-4 cursor-pointer border-2 transition-all ${
        selected ? 'border-blue-500 shadow-lg' : 'border-border hover:border-primary/60'
      }`}
      onClick={() => onSelect?.(packageFX.id)}
    >
      <Icons.walletPackageCard className="w-12 h-12" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">
            {formatCurrency(packageFX.fxAmount, CURRENCY.FX, {
              applyExchangeRate: false,
            })}
          </span>
          {isPopular && (
            <Badge className="bg-orange-100 text-orange-700 font-medium">Popular</Badge>
          )}
        </div>
        <div className="text-muted-foreground text-sm">{formatCurrency(usdAmount, currency)}</div>
      </div>

      <RadioGroupItem
        value={packageFX.id}
        checked={selected}
        aria-label={packageFX.fxAmount + ' FX'}
      />
    </Card>
  );
};

export default WalletDepositPackageCard;
