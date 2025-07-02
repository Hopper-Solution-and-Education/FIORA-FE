'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroupItem } from '@/components/ui/radio-group';
import type { PackageFX } from '../../../../domain/entity/PackageFX';
import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { CURRENCY } from '@/shared/constants';
import { Icons } from '@/components/Icon';
import { EXCHANGE_RATES_TO_USD } from '@/shared/utils/currencyExchange';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { useAppSelector } from '@/store';

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

  // Calculate USD amount using proper exchange rate
  const usdAmount = packageFX.fxAmount / EXCHANGE_RATES_TO_USD.FX;

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
            {formatFIORACurrency(packageFX.fxAmount, CURRENCY.FX)}
          </span>
          {isPopular && (
            <Badge className="bg-orange-100 text-orange-700 font-medium">Popular</Badge>
          )}
        </div>
        <div className="text-muted-foreground text-sm">
          {formatFIORACurrency(convertCurrency(usdAmount, CURRENCY.USD, currency), currency)}
        </div>
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
