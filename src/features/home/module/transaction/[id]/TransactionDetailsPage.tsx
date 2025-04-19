'use client';

import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { useEffect, useState } from 'react';
import { IRelationalTransaction } from '../types';
import TransactionDetails from './components/TransactionDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type TransactionDetailsPageProps = {
  id: string;
};

const TransactionDetailsPage = ({ id }: TransactionDetailsPageProps) => {
  const router = useRouter();
  const { data, error, isLoading } = useDataFetcher<any>({
    endpoint: id ? `/api/transactions/${id}` : null,
    method: 'GET',
  });

  const [transaction, setTransaction] = useState<IRelationalTransaction | null>(null);

  useEffect(() => {
    if (data && data.data) {
      setTransaction(data.data);
    }
  }, [data]);

  // const renderTransactionName = useMemo((): string => {
  //   if (!transaction) return 'Transaction Details';

  //   const date = transaction.date ? new Date(transaction.date).toLocaleDateString() : '';

  //   return `${transaction.type} - ${date}`;
  // }, [transaction]);

  // No data component
  const NoDataDisplay = () => (
    <Card>
      <CardContent className="py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <FileX size={48} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Transaction Data</h3>
            <p className="text-muted-foreground">
              This transaction could not be found or may have been deleted.
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/transaction')}>
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container px-4 py-6 mx-auto">
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold">{renderTransactionName}</h1>
        <p className="text-muted-foreground">View detailed information about this transaction</p>
      </div> */}

      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-1/2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-destructive">Error loading transaction details.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : transaction ? (
        <TransactionDetails data={transaction} />
      ) : (
        <NoDataDisplay />
      )}
    </div>
  );
};

export default TransactionDetailsPage;
