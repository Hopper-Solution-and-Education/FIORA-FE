import { MetricCard } from '@/components/common/metric';
import { Skeleton } from '@/components/ui/skeleton';
import useCurrencyFormatter from '@/shared/hooks/useCurrencyFormatter';
import { Currency } from '@/shared/types';
import { useAppSelector } from '@/store';
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from 'lucide-react';
import { FinanceByDate, FinanceResult } from '../../domain/entities';

const MetricCards = () => {
  const viewBy = useAppSelector((state) => state.financeControl.viewBy);
  const financeByDate = useAppSelector((state) => state.financeControl.financeByDate);
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const financeByAccount = useAppSelector((state) => state.financeControl.financeByAccount);
  const financeByProduct = useAppSelector((state) => state.financeControl.financeByProduct);
  const financeByPartner = useAppSelector((state) => state.financeControl.financeByPartner);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const currency = useAppSelector((state) => state.settings.currency);
  const { getExchangeAmount } = useCurrencyFormatter();

  const calculateTotals = (data: FinanceResult[] | FinanceByDate[]) => {
    const totals = {
      income: 0,
      expense: 0,
      total: 0,
    };

    data.forEach((item) => {
      if ('totalIncome' in item) {
        const income = getExchangeAmount({
          amount: Number(item.totalIncome),
          fromCurrency: item.currency as Currency,
          toCurrency: currency,
        }).convertedAmount;

        const expense = getExchangeAmount({
          amount: Number(item.totalExpense),
          fromCurrency: item.currency as Currency,
          toCurrency: currency,
        }).convertedAmount;

        const total = income - expense;

        totals.income += income;
        totals.expense += expense;
        totals.total += total;
      }
    });

    return totals;
  };

  const getCurrentData = () => {
    switch (viewBy) {
      case 'date':
        return financeByDate;
      case 'category':
        return financeByCategory;
      case 'account':
        return financeByAccount;
      case 'product':
        return financeByProduct;
      case 'partner':
        return financeByPartner;
      default:
        return [];
    }
  };

  const totals = calculateTotals(getCurrentData());

  const LoadingCard = () => (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  const renderDateMetrics = () => (
    <>
      {isLoading ? (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      ) : (
        <>
          <MetricCard
            title="Total Income"
            value={totals.income}
            currency={currency}
            type="income"
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
            description="Total income for the selected period"
          />
          <MetricCard
            title="Total Expense"
            value={totals.expense}
            currency={currency}
            type="expense"
            icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
            description="Total expenses for the selected period"
          />
          <MetricCard
            title="Net Total"
            value={totals.total}
            currency={currency}
            type="total"
            icon={
              <TrendingUpIcon
                className={`h-4 w-4 ${totals.total >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}
              />
            }
            description="Net profit/loss for the selected period"
          />
        </>
      )}
    </>
  );

  const renderCategoryMetrics = () => {
    if (isLoading) {
      return (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      );
    }

    return (
      <>
        <MetricCard
          title="Total Income"
          value={totals.income}
          currency={currency}
          type="income"
          icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
          description="Total expenses by category"
        />
        <MetricCard
          title="Total Expense"
          value={totals.expense}
          currency={currency}
          type="expense"
          icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
          description="Total expenses by category"
        />
        <MetricCard
          title="Total Profit"
          value={totals.total}
          currency={currency}
          type="total"
          icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
          description="Total expenses by category"
        />
      </>
    );
  };

  const renderAccountMetrics = () => (
    <>
      {isLoading ? (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      ) : (
        <>
          <MetricCard
            title="Total Income"
            value={totals.income}
            currency={currency}
            type="income"
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
            description="Total income by account"
          />
          <MetricCard
            title="Total Expense"
            value={totals.expense}
            currency={currency}
            type="expense"
            icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
            description="Total expenses by account"
          />
          <MetricCard
            title="Net Total"
            value={totals.total}
            currency={currency}
            type="total"
            icon={
              <TrendingUpIcon
                className={`h-4 w-4 ${totals.total >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}
              />
            }
            description="Net balance by account"
          />
        </>
      )}
    </>
  );

  const renderProductMetrics = () => (
    <>
      {isLoading ? (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      ) : (
        <>
          <MetricCard
            title="Total Income"
            value={totals.income}
            currency={currency}
            type="income"
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
            description="Total income by product"
          />
          <MetricCard
            title="Total Expense"
            value={totals.expense}
            currency={currency}
            type="expense"
            icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
            description="Total expenses by product"
          />
          <MetricCard
            title="Net Total"
            value={totals.total}
            currency={currency}
            type="total"
            icon={
              <TrendingUpIcon
                className={`h-4 w-4 ${totals.total >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}
              />
            }
            description="Net profit/loss by product"
          />
        </>
      )}
    </>
  );

  const renderPartnerMetrics = () => (
    <>
      {isLoading ? (
        <>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </>
      ) : (
        <>
          <MetricCard
            title="Total Income"
            value={totals.income}
            currency={currency}
            type="income"
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
            description="Total income by partner"
          />
          <MetricCard
            title="Total Expense"
            value={totals.expense}
            currency={currency}
            type="expense"
            icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
            description="Total expenses by partner"
          />
          <MetricCard
            title="Net Total"
            value={totals.total}
            currency={currency}
            type="total"
            icon={
              <TrendingUpIcon
                className={`h-4 w-4 ${totals.total >= 0 ? 'text-blue-500' : 'text-yellow-500'}`}
              />
            }
            description="Net balance by partner"
          />
        </>
      )}
    </>
  );

  const renderMetrics = () => {
    switch (viewBy) {
      case 'date':
        return renderDateMetrics();
      case 'category':
        return renderCategoryMetrics();
      case 'account':
        return renderAccountMetrics();
      case 'product':
        return renderProductMetrics();
      case 'partner':
        return renderPartnerMetrics();
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{renderMetrics()}</div>
  );
};

export default MetricCards;
