'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useAppSelector } from '@/store';
import { Check, MoveLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ActionType, ISavingWallet, PackageFX, SavingTransaction } from '../../types';
import { SavingWalletType } from '../../utils/enums';
import SavingPackageCurrency from '../atoms/SavingPackageCurrency';
import { SavingRadioGroup, SavingRadioItem } from '../components/SavingRadioGroup';

type ChildProps = {
  title: string;
  subTitle?: string;
  wallets: ISavingWallet[];
  state: ActionType | null;
  submit: (request: SavingTransaction) => void;
  isOpen: boolean;
  handleClose: () => void;
};

function SavingDepositPage({
  title,
  subTitle,
  wallets,
  state,
  submit,
  isOpen,
  handleClose,
}: ChildProps) {
  const [packageSelected, setPackageSelected] = useState<PackageFX | null>(null);
  const [walletSelected, setWalletSelected] = useState<ISavingWallet | null>(null);

  const packageFX = useAppSelector((state) => state.wallet.packageFX);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      setWalletSelected(wallets[0]);
    }
  }, [wallets]);

  useEffect(() => {
    return () => {
      setPackageSelected(null);
      setWalletSelected(wallets[0]);
    };
  }, [isOpen]);

  const onSubmit = () => {
    if (packageSelected === null) {
      toast.error('Please select a FX amount');
      return;
    }

    if (walletSelected === null) {
      toast.error('Please select a wallet');
      return;
    }

    submit({
      packageFXId: packageSelected?.id ?? '',
      fxAmount: packageSelected?.fxAmount ?? 0,
      action: state as ActionType,
      walletId: walletSelected?.id ?? '',
      walletType: (walletSelected?.type as SavingWalletType) ?? SavingWalletType.PAYMENT,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-fit mx-auto">
        <DialogTitle className="text-3xl text-center font-extrabold text-gray-900 dark:text-gray-100">
          {title}
        </DialogTitle>
        <DialogDescription className="text-center mb-2">{subTitle}</DialogDescription>
        <Card className="w-max">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Icons.moneyAtm height={48} width={48} />
              <span>CHOOSE AMOUNT</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-fit grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center *:w-full">
              {packageFX &&
                packageFX.length > 0 &&
                packageFX
                  .filter((pkg) => pkg.fxAmount >= 100)
                  .sort((a, b) => a.fxAmount - b.fxAmount)
                  .map((pkg) => (
                    <SavingPackageCurrency
                      key={pkg.id}
                      packageFX={pkg}
                      selected={packageSelected?.id === pkg.id}
                      onSelect={() => setPackageSelected(pkg)}
                    />
                  ))}
            </div>
            <div className="text-lg flex items-center justify-start gap-1 mt-8">
              <span>From wallet</span>
              <span className="text-red-600 dark:text-red-400">*</span>
            </div>
            {/* Checkbox to choose wallet */}
            <SavingRadioGroup
              defaultValue={walletSelected}
              getResultValue={(value) => {
                const wallet = wallets.find((w) => w.id === value.id) || null;
                setWalletSelected(wallet);
              }}
            >
              {wallets.map((wallet) => (
                <SavingRadioItem key={wallet.id} value={wallet} label={wallet.name} />
              ))}
            </SavingRadioGroup>
          </CardContent>
        </Card>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button variant="outline" className="w-32 h-14" onClick={handleClose}>
            <MoveLeft className="!w-6 !h-6" />
          </Button>
          <Button
            variant="default"
            className="w-32 h-14 bg-blue-600 dark:bg-blue-400"
            onClick={onSubmit}
          >
            <Check className="!w-6 !h-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SavingDepositPage;
