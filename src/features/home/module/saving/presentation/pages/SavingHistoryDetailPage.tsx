import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY } from '@/shared/constants';
import useCurrencyFormatter from '@/shared/hooks/useCurrencyFormatter';
import LucieIcon from '../../../category/components/LucieIcon';
import { ISavingHistory } from '../../types';
import { formatDateTime } from '../../utils/formatDate';

type ChildProps = {
  field: ISavingHistory;
  handleClose: () => void;
};

// Get transaction type color
const getTypeColor = (type: string) => {
  switch (type) {
    case 'Expense':
      return 'text-red-600 dark:text-red-400';
    case 'Income':
      return 'text-green-600 dark:text-green-400';
    case 'Transfer':
      return 'text-gray-600 dark:text-gray-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

function SavingHistoryDetailPage({ field, handleClose }: ChildProps) {
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <Dialog open={field !== null} onOpenChange={handleClose}>
      <DialogContent className="min-w-fit mx-auto">
        <DialogTitle className="text-3xl text-center font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          SAVING TRANSACTION DETAIL
        </DialogTitle>

        <div className="space-y-2 pb-2 border-b">
          <p className="text-lg font-medium">Basic Information</p>
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-muted-foreground">Date</p>
            <p>{formatDateTime(new Date(field.date))}</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-muted-foreground">Type</p>
            <p className={`font-medium ${getTypeColor(field.type)}`}>{field.type}</p>
          </div>
          <div className="w-full flex items-start justify-between">
            <p className="text-base text-muted-foreground">Amount</p>
            <div className="flex flex-col items-end">
              <p className="font-bold">
                {formatCurrency(field.amount, field?.currency ?? CURRENCY.FX, {
                  applyExchangeRate: true,
                })}
              </p>
              <p className="text-xs text-gray-500">
                (
                {formatCurrency(field.amount, field?.currency ?? CURRENCY.USD, {
                  applyExchangeRate: false,
                })}
                )
              </p>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-muted-foreground">Remark</p>
            {field?.remark ? <p>{field.remark}</p> : <p className="italic text-gray-500">-</p>}
          </div>
        </div>

        <div className="space-y-2 pb-2 border-b">
          <p className="text-lg font-medium">From</p>
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-muted-foreground">Source</p>
            <p className="flex items-center gap-2">
              <span>
                {field.fromWallet?.icon && (
                  <LucieIcon
                    icon={field.fromWallet?.icon}
                    className="w-5 h-5 border-1 border-gray-500"
                  />
                )}
              </span>
              {field.fromWallet?.name || field.fromWallet?.type ? (
                <span>{field.fromWallet?.name || field.fromWallet?.type}</span>
              ) : (
                <span className="italic text-gray-500">Unknown</span>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-2 pb-2 border-b">
          <p className="text-lg font-medium">To</p>
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-muted-foreground">Wallet</p>
            <p className="flex items-center gap-2">
              <span>
                {field.toWallet?.icon && (
                  <LucieIcon
                    icon={field.toWallet?.icon}
                    className="w-5 h-5 border-1 border-gray-500"
                  />
                )}
              </span>
              {field.toWallet?.name || field.toWallet?.type ? (
                <span>{field.toWallet?.name || field.toWallet?.type}</span>
              ) : (
                <span className="italic text-gray-500">Unknown</span>
              )}
            </p>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-40 h-14 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                >
                  <Icons.circleArrowLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="w-40 h-14 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Icons.check className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SavingHistoryDetailPage;
