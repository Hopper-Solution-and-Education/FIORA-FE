import { Icons } from '@/components/Icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/utils';
import { EXCHANGE_RATES_TO_USD } from '@/shared/utils/currencyExchange';
import { useAppSelector } from '@/store';
import { useQRCode } from 'next-qrcode';
import { FRONTEND_ATTACHMENT_CONSTANTS } from '../../data/constant';
import { PackageFX } from '../../domain';
import { WalletUploadProof } from '../molecules';

interface WalletPaymentDetailProps {
  className?: string;
}

const WalletPaymentDetail = ({ className }: WalletPaymentDetailProps) => {
  const { SVG } = useQRCode();
  const selectedPackageId = useAppSelector((state) => state.wallet.selectedPackageId);
  const packageFX = useAppSelector((state) => state.wallet.packageFX);
  const attachmentData = useAppSelector((state) => state.wallet.attachmentData);
  const selectedPackage = packageFX?.find((pkg: PackageFX) => pkg.id === selectedPackageId);

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
  const usdAmount = fxAmount / EXCHANGE_RATES_TO_USD.FX;
  const rate = EXCHANGE_RATES_TO_USD.FX;

  const qrValue = JSON.stringify({ fxAmount, usdAmount, rate, id });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-xl">Payment Details</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Scan the QR code to complete your payment
        </CardDescription>
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

        {attachmentData ? (
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Icons.checkCircle className="w-4 h-4" />
              <span className="font-medium">Payment Proof Uploaded</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Icons.post className="w-3 h-3" />
              <span>{attachmentData.path.split('/').pop()}</span>
              <span className="text-xs">({formatFileSize(attachmentData.size)})</span>
            </div>
          </div>
        ) : (
          <WalletUploadProof />
        )}

        <div className="text-xs text-muted-foreground text-center">
          Supports {FRONTEND_ATTACHMENT_CONSTANTS.SUPPORTED_FORMATS} (max{' '}
          {FRONTEND_ATTACHMENT_CONSTANTS.MAX_FILE_SIZE_MB}MB)
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletPaymentDetail;
