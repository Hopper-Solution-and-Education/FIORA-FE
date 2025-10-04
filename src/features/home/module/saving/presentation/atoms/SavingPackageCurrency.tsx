'use client';

import { Icons } from '@/components/Icon';
import { Card } from '@/components/ui/card';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import React from 'react';
import type { PackageFX } from '../../types';

interface ISavingPackageCardProps {
  packageFX: PackageFX;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const SavingPackageCurrency: React.FC<ISavingPackageCardProps> = ({
  packageFX,
  selected = false,
  onSelect,
}) => {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <Card
      className={`w-fit flex items-center gap-4 px-4 py-2 cursor-pointer border-2 transition-all ${
        selected ? 'border-blue-500 bg-blue-500 shadow-lg' : 'border-border hover:border-primary/60'
      }`}
      onClick={() => onSelect?.(packageFX.id)}
    >
      <Icons.walletPackageCard className="size-8" />

      <div className="flex items-center gap-2">
        <span className="font-semibold text-base">
          {formatCurrency(packageFX.fxAmount, CURRENCY.FX, {
            applyExchangeRate: false,
          })}
        </span>
      </div>
    </Card>
  );
};

export default SavingPackageCurrency;
