'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup } from '@/components/ui/radio-group';
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
        'flex items-center justify-center gap-3 p-3 cursor-pointer border-2 transition-all',
        selected ? 'border-blue-500 shadow-lg' : 'border-border hover:border-primary/60',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={() => !disabled && onSelect?.(packageFX.id)}
    >
      <Icons.walletPackageCard className="w-8 h-8" />

      <div className="flex items-center gap-2">
        <span className="font-semibold">{packageFX.fxAmount.toLocaleString()} FX</span>
      </div>

      <div className="w-4 h-4 rounded-full border-2 border-primary">
        {selected && <div className="w-full h-full bg-primary rounded-full" />}
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
  const formattedBalance = useMemo(() => availableBalance.toLocaleString(), [availableBalance]);

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
      toast.success('Withdrawal requested successfully');
      handleOpenChange(false);
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || 'Unable to process withdrawal right now.';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">CLAIM</DialogTitle>
          <DialogDescription className="text-center text-base">
            CLAIM TO PAYMENT WALLET
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Package Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">CHOOSE AMOUNT</label>
                <span className="text-sm text-muted-foreground font-medium  ">
                  Available balance: {formattedBalance} FX
                </span>
              </div>

              <div className="max-h-[50vh] overflow-y-auto space-y-3">
                <RadioGroup
                  value={selectedPackageId ?? ''}
                  onValueChange={setSelectedPackageId}
                  className="grid grid-cols-3 gap-3"
                >
                  {fxPackages.map((pkg) => (
                    <ReferralPackageCard
                      key={pkg.id}
                      packageFX={pkg}
                      selected={selectedPackageId === pkg.id}
                      onSelect={setSelectedPackageId}
                      disabled={pkg.fxAmount > availableBalance}
                    />
                  ))}
                </RadioGroup>
              </div>
            </div>

            <DefaultSubmitButton
              isSubmitting={isSubmitting}
              disabled={isSubmitting || belowThreshold || !selectedPackageId || insufficientBalance}
              onSubmit={handleSubmit}
              onBack={() => handleOpenChange(false)}
              backTooltip="Cancel"
              submitTooltip="Withdraw"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralWithdrawDialog;
