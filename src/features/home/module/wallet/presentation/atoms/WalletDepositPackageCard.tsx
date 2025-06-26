import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroupItem } from '@/components/ui/radio-group';
import type { PackageFX } from '../../domain/entity/PackageFX';
import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { CURRENCY } from '@/shared/constants';

const USD_RATE = 1;

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
  return (
    <Card
      className={`flex items-center gap-4 p-4 cursor-pointer border-2 transition-all ${
        selected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/60'
      }`}
      onClick={() => onSelect?.(packageFX.id)}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-100 text-violet-600">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8v4l3 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

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
          {formatFIORACurrency(packageFX.fxAmount * USD_RATE, CURRENCY.USD)}
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
