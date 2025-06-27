import React from 'react';
import { useSelector } from 'react-redux';
import { useQRCode } from 'next-qrcode';
import type { RootState } from '@/store';
import { WalletUploadProof } from '../molecules';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { EXCHANGE_RATES_TO_USD } from '@/shared/utils/currencyExchange';
import { PackageFX } from '../../domain';

const WalletPaymentDetail: React.FC = () => {
  const { SVG } = useQRCode();
  const selectedPackageId = useSelector((state: RootState) => state.wallet.selectedPackageId);
  const packageFX = useSelector((state: RootState) => state.wallet.packageFX);
  const selectedPackage = packageFX?.find((pkg: PackageFX) => pkg.id === selectedPackageId);

  if (!selectedPackage) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Select a package to see payment details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { fxAmount, id } = selectedPackage;
  const usdAmount = fxAmount / EXCHANGE_RATES_TO_USD.FX;
  const rate = EXCHANGE_RATES_TO_USD.FX;

  const qrValue = JSON.stringify({ fxAmount, usdAmount, rate, id });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Scan the QR code to complete your payment</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-full bg-muted rounded-xl p-6 flex flex-col items-center">
          <div className="text-3xl font-bold">{fxAmount} FX</div>
          <div className="text-xl text-muted-foreground font-semibold">${usdAmount} USD</div>
          <div className="text-sm text-muted-foreground">Rate: 1 USD = {rate} FX</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white rounded-xl p-4 shadow">
            <SVG text={qrValue} options={{ width: 160, margin: 2 }} />
          </div>
          <div className="text-xs text-muted-foreground">QR Code for ${usdAmount} USD</div>
        </div>
        <WalletUploadProof />
        <div className="text-xs text-muted-foreground text-center">
          Supports JPG, JPEG, PNG, PDF (max 5MB)
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletPaymentDetail;
