import { Icon } from '@/components/common/atoms';
import { TableSkeleton } from '@/components/common/organisms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { ICON_SIZE } from '@/shared/constants/size';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';

type SortConfig = {
  key: 'name' | 'totalIncome' | 'totalExpense';
  direction: 'asc' | 'desc';
};

const TableByCategory = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const viewChartByCategory = useAppSelector((state) => state.financeControl.viewChartByCategory);
  const dispatch = useAppDispatch();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const { formatCurrency } = useCurrencyFormatter();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        getFinanceByCategoryAsyncThunk({
          type: FinanceReportEnum.CATEGORY,
          filter:
            viewChartByCategory === 'income'
              ? FinanceReportFilterEnum.INCOME
              : FinanceReportFilterEnum.EXPENSE,
        }),
      );
    }
  }, [dispatch, viewChartByCategory]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = [...financeByCategory].sort((a, b) => {
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  if (isLoading) {
    return <TableSkeleton columns={2} rows={5} />;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mt-4">Finance Data by Category</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">
                <div className="flex items-center gap-2 justify-start w-full">
                  <Icons.clipboardList size={ICON_SIZE.SM} />
                  <span>Category Name</span>
                </div>
              </TableHead>
              <TableHead className="w-[50%] text-right">
                <Button
                  variant="ghost"
                  onClick={() =>
                    handleSort(viewChartByCategory === 'income' ? 'totalIncome' : 'totalExpense')
                  }
                  className="flex items-center gap-2 justify-end w-full"
                >
                  <Icons.wallet size={ICON_SIZE.SM} />
                  <span>{viewChartByCategory === 'income' ? 'Income' : 'Expense'}</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon icon={item.icon ?? ''} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className="text-right"
                  style={{
                    color:
                      viewChartByCategory === 'income'
                        ? COLORS.DEPS_SUCCESS.LEVEL_2
                        : COLORS.DEPS_DANGER.LEVEL_2,
                  }}
                >
                  {viewChartByCategory === 'income'
                    ? formatCurrency(item.totalIncome, item.currency)
                    : formatCurrency(item.totalExpense, item.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableByCategory;
