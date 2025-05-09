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
        <div className="flex items-center justify-center">
          <Card className="relative w-full max-w-lg shadow-lg">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-8 w-1/3" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4 ml-auto" />

                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3 ml-auto" />

                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2 ml-auto" />
                  </div>
                </div>
                <Skeleton className="h-px w-full" /> {/* Separator */}
                {/* From section */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-px w-full" /> {/* Separator */}
                {/* To section */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                {/* Footer buttons */}
                <div className="flex justify-between gap-4 mt-6">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
