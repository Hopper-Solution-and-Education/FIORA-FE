'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/shared/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ReferralPackageCardProps {
  packageFX: {
    id: string;
    fxAmount: number;
  };
  selected?: boolean;
  onSelect?: (id: string) => void;
  disabled?: boolean;
}

interface ReferralWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWithdraw: (amount: number) => Promise<void>;
  isSubmitting?: boolean;
  availableBalance?: number;
  minimumThreshold?: number;
}

const ReferralPackageCard = ({
  packageFX,
  selected = false,
  onSelect,
  disabled = false,
}: ReferralPackageCardProps) => {
  return (
    <Card
      className={cn(
        'w-fit flex items-center gap-4 px-4 py-2 cursor-pointer border-2 transition-all',
        selected
          ? 'border-blue-500 bg-blue-500 shadow-lg'
          : 'border-border hover:border-primary/60',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={() => !disabled && onSelect?.(packageFX.id)}
    >
      <Icons.walletPackageCard className="size-8" />

      <div className="flex items-center gap-2">
        <span className="font-semibold text-base">{packageFX.fxAmount.toLocaleString()} FX</span>
      </div>
    </Card>
  );
};

const ReferralWithdrawDialog = ({
  open,
  onOpenChange,
  onWithdraw,
  isSubmitting,
  availableBalance = 0,
  minimumThreshold = 100,
}: ReferralWithdrawDialogProps) => {
  // Hard-coded FX packages as shown in the UI
  const fxPackages = useMemo(
    () => [
      { id: '100', fxAmount: 100 },
      { id: '200', fxAmount: 200 },
      { id: '500', fxAmount: 500 },
      { id: '1000', fxAmount: 1000 },
      { id: '2000', fxAmount: 2000 },
      { id: '5000', fxAmount: 5000 },
      { id: '10000', fxAmount: 10000 },
      { id: '20000', fxAmount: 20000 },
      { id: '50000', fxAmount: 50000 },
      { id: '100000', fxAmount: 100000 },
    ],
    [],
  );

  // Auto-select 100FX if available balance > 100
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedPackageId(null);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    } else if (availableBalance >= 100) {
      setSelectedPackageId('100');
    }
  }, [open, availableBalance, resetState]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      resetState();
    }
  };

  const selectedPackage = useMemo(() => {
    if (!selectedPackageId) return null;
    return fxPackages.find((pkg) => pkg.id === selectedPackageId);
  }, [selectedPackageId, fxPackages]);

  const selectedAmount = useMemo(() => selectedPackage?.fxAmount || 0, [selectedPackage]);

  const insufficientBalance = selectedAmount > 0 && selectedAmount > availableBalance;
  const belowThreshold = availableBalance < minimumThreshold;

  const handleSubmit = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package to withdraw.');
      return;
    }

    const value = selectedPackage.fxAmount;
    if (value > availableBalance) {
      toast.error('Amount exceeds your available referral balance.');
      return;
    }

    try {
      await onWithdraw(value);
      setSelectedPackageId(null);
      handleOpenChange(false);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || 'Unable to process withdrawal right now.';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-fit mx-auto">
        <DialogTitle className="text-3xl text-center font-extrabold text-gray-900 dark:text-gray-100">
          CLAIM
        </DialogTitle>
        <DialogDescription className="text-center mb-2">CLAIM TO PAYMENT WALLET</DialogDescription>
        <Card className="w-max">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Icons.walletPackageCard height={48} width={48} />
              <span>CHOOSE AMOUNT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-fit grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center *:w-full">
              {fxPackages
                .filter((pkg) => pkg.fxAmount >= 100)
                .sort((a, b) => a.fxAmount - b.fxAmount)
                .map((pkg) => (
                  <ReferralPackageCard
                    key={pkg.id}
                    packageFX={pkg}
                    selected={selectedPackageId === pkg.id}
                    onSelect={setSelectedPackageId}
                    disabled={pkg.fxAmount > availableBalance}
                  />
                ))}
            </div>
            <div className="text-lg flex items-center justify-start gap-1 mt-8">
              <span>From wallet</span>
              <span className="text-red-600 dark:text-red-400">*</span>
            </div>
            <div className="w-fit flex gap-2 mt-2">
              <label className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg shadow">
                <input
                  type="radio"
                  name="referral-wallet"
                  value="referral"
                  checked={true}
                  className="cursor-pointer"
                  readOnly
                />
                <span className="text-sm font-medium">Referral</span>
              </label>
            </div>
          </CardContent>
        </Card>
        {/* <div className="flex items-center justify-between gap-4 mt-4">
          <CommonTooltip content="Cancel and go back">
            <Button variant="outline" className="w-32 h-14" onClick={() => handleOpenChange(false)}>
              <CircleArrowLeft />
            </Button>
          </CommonTooltip>
          <CommonTooltip content="Withdraw">
            <Button
              variant="default"
              className="w-32 h-14 bg-blue-600 dark:bg-blue-400"
              onClick={handleSubmit}
              disabled={isSubmitting || belowThreshold || !selectedPackageId || insufficientBalance}
            >
              <Check />
            </Button>
          </CommonTooltip>
        </div> */}

        <DefaultSubmitButton
          isSubmitting={isSubmitting}
          disabled={isSubmitting || belowThreshold || !selectedPackageId || insufficientBalance}
          onSubmit={handleSubmit}
          onBack={() => handleOpenChange(false)}
          backTooltip="Cancel"
          submitTooltip="Withdraw"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReferralWithdrawDialog;
