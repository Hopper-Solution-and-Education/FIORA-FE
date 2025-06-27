import React from 'react';
import { WalletDepositPackageCard } from '../atoms';
import { useInitializePackageFX } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';

interface WalletPackageListProps {
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  className?: string;
}

const WalletPackageList = ({ selectedId, setSelectedId, className }: WalletPackageListProps) => {
  const { packageFX, loading, error } = useInitializePackageFX();
  const getIsPopular = (pkg: { fxAmount: number }) => pkg.fxAmount === 250;
  const depositSearch = useAppSelector((state) => state.wallet.depositSearch);

  const filteredPackageFX = packageFX
    ?.filter((pkg) => {
      if (depositSearch) {
        return pkg.fxAmount.toString().includes(depositSearch);
      }
      return true;
    })
    .sort((a, b) => a.fxAmount - b.fxAmount);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-xl">Select FX Package</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Choose the amount of FX you want to deposit
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="overflow-y-auto pr-1 flex flex-col gap-4">
          <RadioGroup
            value={selectedId ?? ''}
            onValueChange={setSelectedId}
            className="flex flex-col gap-4"
          >
            {loading && (
              <div className="text-center text-muted-foreground">Loading FX package...</div>
            )}
            {error && <div className="text-center text-destructive">{error}</div>}
            {!loading && !error && filteredPackageFX && filteredPackageFX.length === 0 && (
              <div className="text-center text-muted-foreground">No FX package</div>
            )}
            {!loading &&
              !error &&
              filteredPackageFX &&
              filteredPackageFX.map((pkg) => (
                <WalletDepositPackageCard
                  key={pkg.id}
                  packageFX={pkg}
                  selected={selectedId === pkg.id}
                  onSelect={setSelectedId}
                  isPopular={getIsPopular(pkg)}
                />
              ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletPackageList;
