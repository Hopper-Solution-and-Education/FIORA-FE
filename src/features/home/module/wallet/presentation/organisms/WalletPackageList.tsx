import React from 'react';
import { WalletDepositPackageCard } from '../atoms';
import { useInitializePackageFX } from '../hooks';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { RadioGroup } from '@/components/ui/radio-group';

interface WalletPackageListProps {
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}

const WalletPackageList: React.FC<WalletPackageListProps> = ({ selectedId, setSelectedId }) => {
  const { packageFX, loading, error } = useInitializePackageFX();
  const getIsPopular = (pkg: { fxAmount: number }) => pkg.fxAmount === 250;

  return (
    <Card className="w-80 min-w-[420px]">
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
            {!loading && !error && packageFX && packageFX.length === 0 && (
              <div className="text-center text-muted-foreground">No FX package</div>
            )}
            {!loading &&
              !error &&
              packageFX &&
              packageFX.map((pkg) => (
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
