'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { useQRCode } from 'next-qrcode';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data';
import { PackageFX } from '../../domain';
import { WalletUploadProof } from '../molecules';

interface WalletPaymentDetailProps {
  className?: string;
}

const WalletPaymentDetail = ({ className }: WalletPaymentDetailProps) => {
  const { SVG } = useQRCode();
  const selectedPackageId = useAppSelector((state) => state.wallet.selectedPackageId);
  const packageFX = useAppSelector((state) => state.wallet.packageFX);
  const selectedPackage = packageFX?.find((pkg: PackageFX) => pkg.id === selectedPackageId);
  const currency = useAppSelector((state) => state.settings.currency);
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();

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

  const { fxAmount, id } = selectedPackage;
  const { convertedAmount: actualAmount, exchangeRate: rate } = getExchangeAmount({
    amount: fxAmount,
    fromCurrency: CURRENCY.FX,
    toCurrency: currency,
  });

  const applyingRate = getExchangeAmount({
    amount: 1,
    fromCurrency: CURRENCY.FX,
    toCurrency: currency,
  });

  const qrValue = JSON.stringify({ fxAmount, usdAmount: actualAmount, rate, id });

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
            <SVG text={qrValue} options={{ width: 160, margin: 2 }} />
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
