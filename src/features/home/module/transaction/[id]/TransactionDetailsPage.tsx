'use client';

import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { useEffect, useMemo, useState } from 'react';
import { IRelationalTransaction } from '../types';
import TransactionDetails from './components/TransactionDetails';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TransactionDetailsPageProps = {
  id: string;
};

const TransactionDetailsPage = ({ id }: TransactionDetailsPageProps) => {
  const { data } = useDataFetcher<IRelationalTransaction>({
    endpoint: `/transaction/${id}`,
    method: 'GET',
  });

  const [transaction, setTransaction] = useState<IRelationalTransaction>(
    {} as IRelationalTransaction,
  );

  useEffect(() => {
    if (data) {
      setTransaction(data.data);
    }
  }, [data]);

  const renderTransactionName: string = useMemo((): string => {
    if (transaction) {
      return `${transaction.type} (${transaction.fromAccount?.name ?? transaction.fromCategory?.name} - ${transaction.toAccount?.name ?? transaction.toCategory?.name})`;
    }
    return 'Transaction Details';
  }, [transaction, data]);
  return (
    <div className="container mx-auto px-4 py-6 min-h-screen">
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {renderTransactionName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionDetails data={transaction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
