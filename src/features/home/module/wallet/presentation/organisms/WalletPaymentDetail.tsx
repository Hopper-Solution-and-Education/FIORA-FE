'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data';
import { PackageFX } from '../../domain';
import { WalletUploadProof } from '../molecules';

interface WalletPaymentDetailProps {
  className?: string;
}

interface Attachment {
  id: string;
  url: string;
}

type PkgFXExtend = PackageFX & {
  attachments: Array<Attachment>;
};

const WalletPaymentDetail = ({ className }: WalletPaymentDetailProps) => {
  const selectedPackageId = useAppSelector((state) => state.wallet.selectedPackageId);
  const packageFX = useAppSelector((state) => state.wallet.packageFX);
  const selectedPackage = packageFX?.find((pkg: PackageFX) => pkg.id === selectedPackageId);
  const currency = useAppSelector((state) => state.settings.currency);
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    setLoadingImage(true);
    if (
      typeof selectedPackage !== 'undefined' &&
      (selectedPackage as PkgFXExtend).attachments &&
      (selectedPackage as PkgFXExtend).attachments.length > 0
    ) {
      const randomIndex = Math.floor(
        Math.random() * (selectedPackage as PkgFXExtend).attachments.length,
      );
      setImageSrc((selectedPackage as PkgFXExtend).attachments[randomIndex].url);
    }
  }, [selectedPackageId]);

  if (!selectedPackage) {
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle className="text-xl">Payment Details</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Select a package to see payment details
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { fxAmount } = selectedPackage;
  const { convertedAmount: actualAmount } = getExchangeAmount({
    amount: fxAmount,
    fromCurrency: CURRENCY.FX,
    toCurrency: currency,
  });

  const applyingRate = getExchangeAmount({
    amount: 1,
    fromCurrency: CURRENCY.FX,
    toCurrency: currency,
  });

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-xl">Payment Details</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Scan the QR code to complete your payment
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4 h-[500px] overflow-y-auto">
        <div className="w-full bg-muted rounded-xl p-6 flex flex-col items-center">
          <div className="text-3xl font-bold">
            {formatCurrency(fxAmount, CURRENCY.FX, {
              applyExchangeRate: false,
            })}
          </div>
          <div className="text-xl text-muted-foreground font-semibold">
            {formatCurrency(actualAmount, currency)}
          </div>
          <div className="text-sm text-muted-foreground">
            Rate:{' '}
            {formatCurrency(applyingRate.originalAmount, applyingRate.fromCurrency, {
              applyExchangeRate: false,
            })}{' '}
            = {formatCurrency(applyingRate.convertedAmount, applyingRate.toCurrency)}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-xl p-4 shadow">
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                hidden={loadingImage}
                src={imageSrc}
                alt={'QR Code for ' + formatCurrency(actualAmount, currency)}
                onLoad={() => setLoadingImage(false)}
                width={320}
                height={320}
              />
            )}
            {loadingImage ? <Skeleton className="w-[320px] h-[320px]" /> : null}
          </div>
          <div className="text-xs text-muted-foreground">
            QR Code for {formatCurrency(actualAmount, currency)}
          </div>
        </div>

        <WalletUploadProof />

        <div className="text-xs text-muted-foreground text-center">
          Supports {FRONTEND_ATTACHMENT_CONSTANTS.SUPPORTED_FORMATS} (max{' '}
          {FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB}MB)
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletPaymentDetail;
