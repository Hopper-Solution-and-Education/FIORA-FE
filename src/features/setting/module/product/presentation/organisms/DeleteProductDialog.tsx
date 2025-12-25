'use client';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import isEmpty from 'lodash/isEmpty';
import { Product } from '../../domain/entities';
import { setProductIdToTransfer } from '../../slices';
import { ProductSelect } from '../atoms';

interface DeleteProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const DeleteProductDialog = ({
  product,
  open,
  onOpenChange,
  onConfirm,
}: DeleteProductDialogProps) => {
  const dispatch = useAppDispatch();
  const isDeletingProduct = useAppSelector((state) => state.productManagement.isDeletingProduct);
  const productToTransferId = useAppSelector(
    (state) => state.productManagement.ProductIdToTransfer,
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      dispatch(setProductIdToTransfer(''));
    }
    onOpenChange(isOpen);
  };

  const isSubmitDisabled =
    isDeletingProduct ||
    !product ||
    (product.transactions.length > 0 && isEmpty(productToTransferId));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'p-0 overflow-visible border-none shadow-2xl',
          'dark:bg-gray-900 dark:text-gray-100',
          'w-[95vw] max-w-md rounded-lg sm:rounded-xl',
          'transition-all duration-200',
        )}
      >
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenChange(false)}
            className={cn(
              'rounded-full h-8 w-8 p-0',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'transition-colors',
            )}
          >
            <Icons.close
              data-test="delete-dialog-close-button"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
            />
          </Button>
        </div>

        <div className={cn('px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6', 'flex flex-col')}>
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div
              className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 rounded-full',
                'bg-red-100 dark:bg-red-900/30',
                'flex items-center justify-center mb-3 sm:mb-4',
              )}
            >
              <Icons.warning
                className={cn('h-5 w-5 sm:h-6 sm:w-6', 'text-red-500 dark:text-red-400')}
              />
            </div>
            <DialogTitle
              className={cn(
                'text-lg sm:text-xl font-semibold',
                'text-gray-800 dark:text-gray-100',
                'text-center',
              )}
            >
              Delete {product?.name}
            </DialogTitle>

            {!isEmpty(product?.transactions) ? (
              <p
                className={cn(
                  'text-center text-sm sm:text-base',
                  'text-gray-600 dark:text-gray-400',
                  'mt-2 max-w-xs',
                )}
              >
                Please link the transactions to another product before deleting.
              </p>
            ) : (
              <p
                className={cn(
                  'text-center text-sm sm:text-base',
                  'text-gray-600 dark:text-gray-400',
                  'mt-2 max-w-xs',
                )}
              >
                Are you sure you want to delete this product?
              </p>
            )}
          </div>

          {!isEmpty(product?.transactions) ? (
            <div
              className={cn(
                'mb-4 sm:mb-6',
                'bg-gray-50 dark:bg-gray-800/50',
                'p-2 rounded-lg',
                'border border-gray-100 dark:border-gray-700',
              )}
            >
              <label
                className={cn(
                  'block text-sm font-medium',
                  'text-gray-700 dark:text-gray-300',
                  'mb-2',
                )}
              >
                Product
              </label>
              <ProductSelect productId={product?.id} />
            </div>
          ) : null}

          <div className={cn('flex gap-2 sm:gap-3 mt-2 sm:mt-4', 'flex-col sm:flex-row')}>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isDeletingProduct}
              className={cn(
                'flex-1 font-medium',
                'border-gray-200 dark:border-gray-700',
                'bg-transparent dark:bg-transparent',
                'text-gray-700 dark:text-gray-300',
                'hover:bg-gray-50 dark:hover:bg-gray-800',
                'order-2 sm:order-1',
              )}
              aria-label="Cancel"
              data-test="delete-dialog-cancel-button"
            >
              <Icons.circleArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isSubmitDisabled}
              className={cn(
                'flex-1 font-medium',
                'bg-red-500 hover:bg-red-600',
                'dark:bg-red-600 dark:hover:bg-red-700',
                'transition-colors',
                'order-1 sm:order-2',
              )}
              aria-label="Delete"
              data-test="delete-dialog-confirm-button"
            >
              {isDeletingProduct ? (
                <span className="flex items-center justify-center gap-2">
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <Icons.check className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
