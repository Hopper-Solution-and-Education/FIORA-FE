import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CURRENCY } from '@/shared/constants';
import useCurrencyFormatter from '@/shared/hooks/useCurrencyFormatter';
import { format } from 'date-fns';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import LucieIcon from '../../../category/components/LucieIcon';
import DeleteTransactionDialog from '../../components/DeleteTransactionDialog';

type TransactionDetailsProps = {
  data: any;
};

const TransactionDetails = ({ data }: TransactionDetailsProps) => {
  // Format the date to a readable format
  const formattedDate = data.date ? format(new Date(data.date), 'Ppp') : 'Unknown';
  const router = useRouter();

  // Initialize currency formatter hook
  const { formatCurrency } = useCurrencyFormatter();

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
          toast.error(responseData?.message || 'Failed to delete transaction');
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
  const isDeleteForbidden = (transaction: any): boolean => {
    // Chỉ check isMarked hoặc isExpired
    return transaction.isMarked || transaction.isExpired;
  };

  return (
    <div className="px-4 pb-6 min-h-screen">
      <div className="flex items-center justify-center">
        <Card className="relative w-full max-w-lg shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transaction Details
            </CardTitle>
            <div className="mb-6">
              <CommonTooltip
                content={
                  data.isMarked || data.isExpired
                    ? "Can't delete marked or expired transactions"
                    : 'Delete Transaction'
                }
              >
                <Button
                  variant="secondary"
                  className={`px-3 py-2 ${
                    isDeleteForbidden(data) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'
                  }`}
                  onClick={() => {
                    if (!isDeleteForbidden(data)) {
                      handleOpenDeleteModal();
                    }
                  }}
                  disabled={isDeleteForbidden(data)}
                >
                  <Trash size={18} color={isDeleteForbidden(data) ? 'gray' : 'red'} />
                </Button>
              </CommonTooltip>
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
                  <div className="font-medium text-right">
                    <div className="space-y-1">
                      {data && (
                        <>
                          <div>
                            {formatCurrency(data.amount, data.currency ?? CURRENCY.USD, {
                              applyExchangeRate: true,
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            (
                            {formatCurrency(data.amount, data.currency ?? CURRENCY.USD, {
                              applyExchangeRate: false,
                            })}
                            )
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className={`text-right ${!data.remark ? 'text-gray-500 italic' : ''}`}>
                    {data.remark || 'Unknown'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* From Account/Category/Wallet */}
              <div className="space-y-2">
                <h3 className="font-medium text-md">From</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.fromAccount && (
                    <>
                      <div className="text-sm text-muted-foreground">Account</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.fromAccount.name}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.fromAccount.icon && (
                              <LucieIcon
                                icon={data.fromAccount.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.fromAccount.name}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {data.fromCategory && (
                    <>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.fromCategory.name}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.fromCategory.icon && (
                              <LucieIcon
                                icon={data.fromCategory.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.fromCategory.name}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {data.fromWallet && (
                    <>
                      <div className="text-sm text-muted-foreground">Wallet</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.fromWallet.type}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.fromWallet.icon && (
                              <LucieIcon
                                icon={data.fromWallet.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.fromWallet.type}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {!data.fromAccount && !data.fromCategory && !data.fromWallet && (
                    <>
                      <div className="text-sm text-muted-foreground">Source</div>
                      <div className="text-right text-gray-500 italic">Unknown</div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* To Account/Category/Wallet */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg">To</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.toAccount && (
                    <>
                      <div className="text-sm text-muted-foreground">Account</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.toAccount.name}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.toAccount.icon && (
                              <LucieIcon
                                icon={data.toAccount.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.toAccount.name}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {data.toCategory && (
                    <>
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.toCategory.name}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.toCategory.icon && (
                              <LucieIcon
                                icon={data.toCategory.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.toCategory.name}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {data.toWallet && (
                    <>
                      <div className="text-sm text-muted-foreground">Wallet</div>
                      <div className="flex justify-end items-center gap-2">
                        <CommonTooltip content={data.toWallet.type}>
                          <div className="flex items-center gap-2 max-w-full">
                            {data.toWallet.icon && (
                              <LucieIcon
                                icon={data.toWallet.icon}
                                className="w-4 h-4 border-1 border-gray-500 flex-shrink-0"
                              />
                            )}
                            <h3 className="overflow-hidden whitespace-nowrap text-ellipsis">
                              {data.toWallet.type}
                            </h3>
                          </div>
                        </CommonTooltip>
                      </div>
                    </>
                  )}

                  {!data.toAccount && !data.toCategory && !data.toWallet && (
                    <>
                      <div className="text-sm text-muted-foreground">Destination</div>
                      <div className="text-right text-gray-500 italic">Unknown</div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Partner Information */}
              <div className="space-y-2">
                <h3 className="font-medium text-md">Partner</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="flex justify-end items-center gap-2">
                    <CommonTooltip content={data.partner?.name || 'Unknown'}>
                      <div className="flex items-center gap-2 max-w-full">
                        {data.partner?.logo && (
                          <Image
                            src={data.partner.logo}
                            alt={data.partner?.name || 'Unknown'}
                            width={30}
                            height={30}
                            className="rounded-full flex-shrink-0"
                          />
                        )}
                        <h3
                          className={`overflow-hidden whitespace-nowrap text-ellipsis ${!data.partner?.name ? 'text-gray-500 italic' : ''}`}
                        >
                          {data.partner?.name || 'Unknown'}
                        </h3>
                      </div>
                    </CommonTooltip>
                  </div>

                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="text-right">
                    <h3
                      className={`overflow-hidden whitespace-nowrap text-ellipsis ${!data.partner?.type ? 'text-gray-500 italic' : ''}`}
                    >
                      {data.partner?.type || 'Unknown'}
                    </h3>
                  </div>
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
                        <div className="text-right">
                          {product?.price ? (
                            <div className="space-y-1">
                              <div>
                                {formatCurrency(
                                  Number(product.price),
                                  data.currency ?? CURRENCY.USD,
                                  {
                                    applyExchangeRate: true,
                                  },
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                (
                                {data?.productsRelation?.[0]?.product?.currency
                                  ? formatCurrency(
                                      Number(product.price),
                                      data.productsRelation?.[0]?.product?.currency,
                                      {
                                        applyExchangeRate: false,
                                      },
                                    )
                                  : 'Unknown'}
                                )
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Unknown</span>
                          )}
                        </div>
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
                  <div className="text-right">
                    Created By:{' '}
                    <span className={!data.createdBy?.email ? 'text-gray-500 italic' : ''}>
                      {data.createdBy?.email || 'System'}
                    </span>
                  </div>
                  <div>
                    Updated:{' '}
                    <span className={!data.updatedAt ? 'text-gray-500 italic' : ''}>
                      {data.updatedAt ? format(new Date(data.updatedAt), 'Ppp') : 'Unknown'}
                    </span>
                  </div>
                  <div className="text-right">
                    Updated By:{' '}
                    <span className={!data.updatedBy?.email ? 'text-gray-500 italic' : ''}>
                      {data.updatedBy?.email || 'System'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <CommonTooltip content="Cancel and go back">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="w-32 h-12 flex items-center justify-center border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white transition-colors duration-200"
                >
                  <Icons.circleArrowLeft className="h-5 w-5" />
                </Button>
              </CommonTooltip>
              <CommonTooltip content="Done reading">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  className="w-32 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <Icons.check className="h-5 w-5" />
                </Button>
              </CommonTooltip>
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
