import { IRelationalTransaction } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { TransactionCurrency } from '../../utils/constants';
import LucieIcon from '../../../category/components/LucieIcon';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import DeleteTransactionDialog from '../../components/DeleteTransactionDialog';
import { toast } from 'sonner';

// Custom formatCurrency function
const formatCurrency = (
  num: number,
  currency: TransactionCurrency,
  shouldShortened?: boolean,
): string => {
  const locale = currency === 'VND' ? 'vi-VN' : 'en-US';
  const currencySymbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
    .format(0)
    .replace(/[\d\s,.]/g, '');

  if (num >= 1000000 && shouldShortened) {
    const inMillions = num / 1000000;
    const formatted = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(inMillions);

    return currency === 'VND'
      ? `${formatted}M ${currencySymbol}`
      : `${currencySymbol} ${formatted}M`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(num);
};

type TransactionDetailsProps = {
  data: IRelationalTransaction;
};

const TransactionDetails = ({ data }: TransactionDetailsProps) => {
  // Format the date to a readable format
  const formattedDate = data.date ? format(new Date(data.date), 'PPP') : 'N/A';
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Get transaction type color
  const getTypeColor = () => {
    switch (data.type) {
      case 'Expense':
        return 'bg-red-500';
      case 'Income':
        return 'bg-green-600';
      case 'Transfer':
        return 'bg-blue-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Format the amount with currency
  const formattedAmount = formatCurrency(
    Number(data.amount),
    (data.currency as TransactionCurrency) || TransactionCurrency.VND,
  );

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTransaction = () => {
    //delete logics here
    const endpoint = `/api/transactions/transaction?id=${data?.id}`;
    setIsDeleting(true);
    fetch(endpoint, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Close the delete modal
          setIsDeleteModalOpen(false);

          // Alert the user of successful deletion
          toast.success('Transaction deleted successfully');

          // Revalidate data
        } else {
          throw new Error('Failed to delete transaction');
        }
      })
      .catch((error) => {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      })
      .finally(
        () => {
          setIsDeleting(false);
        }, // Reset deleting state
      );
  };

  // Navigate to delete page
  const handleCloseDeleteModal = () => {
    //delete logics here
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 pb-6 min-h-screen">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transaction Details
            </CardTitle>
            <div className="mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      className="px-3 py-2 hover:bg-red-200"
                      onClick={() => {
                        handleOpenDeleteModal();
                      }}
                    >
                      <Trash size={18} color="white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Transaction</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Basic Transaction Details */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>{formattedDate}</div>

                  <div className="text-sm text-muted-foreground">Type</div>
                  <div>
                    <Badge className={`${getTypeColor()} text-white`}>{data.type}</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{formattedAmount}</div>

                  {data.remark && (
                    <>
                      <div className="text-sm text-muted-foreground">Remark</div>
                      <div>{data.remark}</div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* From Account/Category */}
              {(data.fromAccount || data.fromCategory) && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">From</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {data.fromAccount && (
                      <>
                        <div className="text-sm text-muted-foreground">Account</div>
                        <div className="flex items-center gap-2">
                          {data.fromAccount.icon && (
                            <LucieIcon
                              icon={data.fromAccount.icon}
                              className="w-4 h-4 border-1 border-gray-500"
                            />
                          )}
                          {data.fromAccount.name}
                        </div>
                      </>
                    )}

                    {data.fromCategory && (
                      <>
                        <div className="text-sm text-muted-foreground">Category</div>
                        <div className="flex items-center gap-2">
                          {data.fromCategory.icon && (
                            <LucieIcon
                              icon={data.fromCategory.icon}
                              className="w-4 h-4 border-1 border-gray-500"
                            />
                          )}
                          {data.fromCategory.name}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* To Account/Category */}
              {(data.toAccount || data.toCategory) && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">To</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {data.toAccount && (
                      <>
                        <div className="text-sm text-muted-foreground">Account</div>
                        <div className="flex items-center gap-2">
                          {data.toAccount.icon && (
                            <LucieIcon
                              icon={data.toAccount.icon}
                              className="w-4 h-4 border-1 border-gray-500"
                            />
                          )}
                          {data.toAccount.name}
                        </div>
                      </>
                    )}

                    {data.toCategory && (
                      <>
                        <div className="text-sm text-muted-foreground">Category</div>
                        <div className="flex items-center gap-2">
                          {data.toCategory.icon && (
                            <LucieIcon
                              icon={data.toCategory.icon}
                              className="w-4 h-4 border-1 border-gray-500"
                            />
                          )}
                          {data.toCategory.name}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Partner Information */}
              {data.partner && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Partner</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="flex items-center gap-2">
                      {data.partner.logo && (
                        <Image
                          src={data.partner.logo}
                          alt={data.partner.name}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      )}
                      {data.partner.name}
                    </div>

                    {data.partner.address && (
                      <>
                        <div className="text-sm text-muted-foreground">Address</div>
                        <div>{data.partner.address}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Products Information */}
              {data.products && Array.isArray(data.products) && data.products.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Products</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {data.products.map((product: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between py-1 border-b border-gray-100"
                      >
                        <span>{product.name}</span>
                        <span>
                          {formatCurrency(
                            Number(product.price),
                            (data.currency as TransactionCurrency) || TransactionCurrency.VND,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Information */}
              <div className="py-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    Created: {data.createdAt ? format(new Date(data.createdAt), 'PPp') : 'N/A'}
                  </div>
                  <div>Created By: {data.createdBy.email || 'N/A'}</div>
                  <div>
                    Updated: {data.updatedAt ? format(new Date(data.updatedAt), 'PPp') : 'N/A'}
                  </div>
                  <div>Updated By: {data.updatedBy.email || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="w-full h-fit flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="mt-2 flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to Transactions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
      <DeleteTransactionDialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteTransaction}
        data={data}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default TransactionDetails;
