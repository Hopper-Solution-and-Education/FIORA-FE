'use client';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import useCurrencyFormatter from '@/shared/hooks/useCurrencyFormatter';
import { cn } from '@/shared/utils';
import { RootState } from '@/store/rootReducer';
import { useSelector } from 'react-redux';
import { IRelationalTransaction } from '../types';
import { TRANSACTION_TYPE } from '../utils/constants';
import { formatDate } from '../utils/formatDate';

type DeleteAccountDialogProps = {
  open: boolean;
  onDelete: () => void;
  onClose: () => void;
  data: IRelationalTransaction | undefined;
  isDeleting: boolean;
};

const DeleteTransactionDialog = (props: DeleteAccountDialogProps) => {
  const { data, onClose, onDelete, open, isDeleting } = props;
  const { baseCurrency } = useSelector((state: RootState) => state.settings);

  // Initialize currency formatter hook
  const { formatCurrency } = useCurrencyFormatter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Delete Transaction
        </DialogTitle>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-red-100 rounded-full p-6">
            <Icons.trash className="h-8 w-8 text-red-600" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <div className="text-sm text-left space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                  <span
                    className={`font-semibold text-${TRANSACTION_TYPE[data?.type?.toUpperCase() || '']}`}
                  >
                    {data?.type || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {data?.date ? formatDate(new Date(data.date.toString())) : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Amount:</span>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-right">
                    {data ? (
                      <div className="space-y-1">
                        <div>{formatCurrency(Number(data.amount), baseCurrency)}</div>
                        {data.currency && data.currency !== baseCurrency && (
                          <div className="text-xs text-gray-500">
                            Original: {formatCurrency(Number(data.amount), data.currency)}
                          </div>
                        )}
                      </div>
                    ) : (
                      'Unknown'
                    )}
                  </div>
                </div>
                {data?.remark && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Remark:</span>
                    <span className="text-gray-900 dark:text-gray-100">{data.remark}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Warning text */}
            <p className="text-xs text-red-600 dark:text-red-400 mb-6">
              {data && (
                <>
                  You are about to delete a{' '}
                  <strong className={`text-${TRANSACTION_TYPE[data.type.toUpperCase()]}`}>
                    {data.type}
                  </strong>{' '}
                  on{' '}
                  <strong className={`text-${TRANSACTION_TYPE[data.type.toUpperCase()]}`}>
                    {formatDate(new Date(data.date.toString()))}
                  </strong>{' '}
                  with amount{' '}
                  <strong className={`text-${TRANSACTION_TYPE[data.type.toUpperCase()]}`}>
                    {formatCurrency(Number(data.amount), baseCurrency)}
                    {data.currency && data.currency !== baseCurrency && (
                      <span className="text-gray-500">
                        {' '}
                        (Original: {formatCurrency(Number(data.amount), data.currency)})
                      </span>
                    )}
                  </strong>
                </>
              )}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              This action will permanently remove this transaction from your records and cannot be
              reversed. Please make sure this is the transaction you want to delete.
            </p>
          </div>

          <div className="flex w-full space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              disabled={isDeleting}
              className={cn(
                'flex-1 bg-red-600 hover:bg-red-700 text-white',
                'disabled:bg-red-400 disabled:cursor-not-allowed',
                'transition-colors duration-200',
              )}
            >
              {isDeleting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Transaction'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
