import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY } from '@/shared/constants';
import useCurrencyFormatter from '@/shared/hooks/useCurrencyFormatter';
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
        <DialogTitle className="text-3xl text-center font-extrabold text-gray-900 dark:text-gray-100">
          SAVING TRANSACTION DETAIL
        </DialogTitle>

        <Card className="w-[500px] mt-8">
          <CardContent className="w-full p-4 space-y-2">
            <p className="text-lg font-medium mb-6">Basic Information</p>
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-muted-foreground">Date</p>
              <p>{formatDateTime(field.date)}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-muted-foreground">Type</p>
              <p className={`font-medium ${getTypeColor(field.type)}`}>{field.type}</p>
            </div>
            <div className="w-full flex items-start justify-between">
              <p className="text-base text-muted-foreground">Amount</p>
              <div className="flex flex-col items-end">
                <p>
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
              <p className="text-base text-muted-foreground">Description</p>
              {field?.description ? (
                <p>{field.description}</p>
              ) : (
                <p className="italic text-gray-500">-</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-[500px]">
          <CardContent className="w-full p-4 space-y-2">
            <p className="text-lg font-medium mb-6">From</p>
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-muted-foreground">Source</p>
              <p>{field.from}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-[500px]">
          <CardContent className="w-full p-4 space-y-2">
            <p className="text-lg font-medium mb-6">To</p>
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-muted-foreground">Wallet</p>
              <p>{field.to}</p>
            </div>
          </CardContent>
        </Card>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleClose}
                className="w-60 h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 mx-auto mt-6"
              >
                <Icons.check className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Done reading</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
}

export default SavingHistoryDetailPage;
