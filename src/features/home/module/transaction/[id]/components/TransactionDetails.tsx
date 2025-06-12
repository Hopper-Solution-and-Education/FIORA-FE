import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteTransactionDialog from '../../components/DeleteTransactionDialog';
import { IRelationalTransaction } from '../../types';
import { TransactionCurrency } from '../../utils/constants';
import LucieIcon from '../../../category/components/LucieIcon';

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
  const formattedDate = data.date ? format(new Date(data.date), 'Ppp') : 'Unknown';
  const router = useRouter();

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
      .then(async (response) => {
        const responseData = await response.json();
        if (response.ok) {
          // Close the delete modal
          setIsDeleteModalOpen(false);

          // Alert the user of successful deletion
          toast.success('Transaction deleted successfully');
          router.push('/transaction');

          // Revalidate data
        } else {
          toast.error(responseData.message || 'Failed to delete transaction');
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
        <Card className="relative w-full max-w-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transaction Details
            </CardTitle>
            <div className="mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="px-3 py-2 hover:bg-red-200"
                      onClick={() => {
                        handleOpenDeleteModal();
                      }}
                    >
                      <Trash size={18} color="red" />
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
                <h3 className="font-medium text-md">Basic Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className={`text-right ${!data.date ? 'text-gray-500 italic' : ''}`}>
                    {formattedDate}
                  </div>

                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="flex justify-end">
                    <Badge
                      className={`${getTypeColor()} text-white cursor-default hover:${getTypeColor()}`}
                    >
                      {data.type || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium text-right">{formattedAmount}</div>

                  <div className="text-sm text-muted-foreground">Remark</div>
                  <div className={`text-right ${!data.remark ? 'text-gray-500 italic' : ''}`}>
                    {data.remark || 'Unknown'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* From Account/Category */}
              <div className="space-y-2">
                <h3 className="font-medium text-md">From</h3>
                {data.fromAccount && (
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Account</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-end items-center gap-2 w-fit max-w-[60%]">
                            {data.fromAccount.icon && (
                              <LucieIcon
                                icon={data.fromAccount.icon}
                                className="w-4 h-4 border-1 border-gray-500"
                              />
                            )}

                            <h3 className="w-fit overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.fromAccount.name}
                            </h3>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{data.fromAccount.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {data.fromCategory && (
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-end items-center gap-2 w-fit max-w-[60%]">
                            {data.fromCategory.icon && (
                              <LucieIcon
                                icon={data.fromCategory.icon}
                                className="w-4 h-4 border-1 border-gray-500"
                              />
                            )}

                            <h3 className="w-fit overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.fromCategory.name}
                            </h3>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{data.fromCategory.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {!data.fromAccount && !data.fromCategory && (
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Source</div>
                    <div className="text-gray-500 italic">Unknown</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* To Account/Category */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg">To</h3>
                {data.toAccount && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Account</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-end items-center gap-2 w-fit max-w-[60%]">
                            {data.toAccount.icon && (
                              <LucieIcon
                                icon={data.toAccount.icon}
                                className="w-4 h-4 border-1 border-gray-500"
                              />
                            )}

                            <h3 className="w-fit overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.toAccount.name}
                            </h3>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{data.toAccount.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {data.toCategory && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Category</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-end items-center gap-2 w-fit max-w-[60%]">
                            {data.toCategory.icon && (
                              <LucieIcon
                                icon={data.toCategory.icon}
                                className="w-4 h-4 border-1 border-gray-500"
                              />
                            )}

                            <h3 className="w-fit overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.toCategory.name}
                            </h3>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{data.toCategory.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}

                {!data.toAccount && !data.toCategory && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Destination</div>
                    <div className="text-gray-500 italic">Unknown</div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Partner Information */}
              <div className="space-y-2">
                <h3 className="font-medium text-md">Partner</h3>
                <div className="relative w-full flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Name</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-end items-center gap-2 w-fit max-w-[60%]">
                          {data.partner?.logo && (
                            <Image
                              src={data.partner.logo}
                              alt={data.partner?.name || 'Unknown'}
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                          )}
                          <h3
                            className={`w-fit overflow-hidden whitespace-nowrap text-ellipsis ${!data.partner?.name ? 'text-gray-500 italic' : ''}`}
                          >
                            {data.partner?.name || 'Unknown'}
                          </h3>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{data.partner?.name || 'Unknown'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative w-full flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Type</div>
                  <h3
                    className={`w-fit overflow-hidden whitespace-nowrap text-ellipsis ${!data.partner?.type ? 'text-gray-500 italic' : ''}`}
                  >
                    {data.partner?.type || 'Unknown'}
                  </h3>
                </div>
              </div>

              <Separator />

              {/* Products Information */}
              <div className="relative space-y-2">
                <h3 className="font-medium text-lg">Products</h3>
                <div className="grid grid-cols-1 gap-2">
                  {data.products && Array.isArray(data.products) && data.products.length > 0 ? (
                    data.products.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between py-1">
                        <span className={!product?.name ? 'text-gray-500 italic' : ''}>
                          {product?.name || 'Unknown'}
                        </span>
                        <span>
                          {product?.price ? (
                            formatCurrency(
                              Number(product.price),
                              (data.currency as TransactionCurrency) || TransactionCurrency.VND,
                            )
                          ) : (
                            <span className="text-gray-500 italic">Unknown</span>
                          )}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic text-end py-2">Unknown</div>
                  )}
                </div>
              </div>

              {/* Meta Information */}
              <div className="py-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>
                    Created:{' '}
                    <span className={!data.createdAt ? 'text-gray-500 italic' : ''}>
                      {data.createdAt ? format(new Date(data.createdAt), 'Ppp') : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    Created By:{' '}
                    <span className={!data.createdBy?.email ? 'text-gray-500 italic' : ''}>
                      {data.createdBy?.email || 'Unknown'}
                    </span>
                  </div>
                  <div>
                    Updated:{' '}
                    <span className={!data.updatedAt ? 'text-gray-500 italic' : ''}>
                      {data.updatedAt ? format(new Date(data.updatedAt), 'Ppp') : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    Updated By:{' '}
                    <span className={!data.updatedBy?.email ? 'text-gray-500 italic' : ''}>
                      {data.updatedBy?.email || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <TooltipProvider>
              <div className="flex justify-between gap-4 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => router.back()}
                      className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                    >
                      <Icons.circleArrowLeft className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cancel and go back</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Icons.check className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Done reading</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
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
