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
import { COLORS } from '@/shared/constants/chart';
import { ICON_SIZE } from '@/shared/constants/size';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppSelector } from '@/store';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

type SortConfig = {
  key: 'totalIncome' | 'totalExpense' | 'profit';
  direction: 'asc' | 'desc';
};

const TableByDate = () => {
  const financeByDate = useAppSelector((state) => state.financeControl.financeByDate);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'totalIncome',
    direction: 'asc',
  });
  const currency = useAppSelector((state) => state.settings.currency);
  const { formatCurrency } = useCurrencyFormatter();

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = [...financeByDate].sort((a, b) => {
    if (sortConfig.key === 'profit') {
      const profitA = a.totalIncome - a.totalExpense;
      const profitB = b.totalIncome - b.totalExpense;
      return sortConfig.direction === 'asc' ? profitA - profitB : profitB - profitA;
    }
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  if (isLoading) {
    return <TableSkeleton columns={4} rows={5} />;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mt-4">Finance Data by Date</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">
                <div className="flex items-center gap-2">
                  <Icons.calendar size={ICON_SIZE.SM} />
                  <span>Period</span>
                </div>
              </TableHead>
              <TableHead className="w-[25%] text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('totalExpense')}
                  className="flex items-center gap-2 justify-center w-full"
                >
                  <Icons.shoppingCart size={ICON_SIZE.SM} />
                  <span>Expense</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[25%] text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('totalIncome')}
                  className="flex items-center gap-2 justify-center w-full"
                >
                  <Icons.wallet size={ICON_SIZE.SM} />
                  <span>Income</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[25%] text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('profit')}
                  className="flex items-center gap-2 justify-center w-full"
                >
                  <Icons.trendingUp size={ICON_SIZE.SM} />
                  <span>Profit</span>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.period}</TableCell>
                <TableCell className="text-center" style={{ color: COLORS.DEPS_DANGER.LEVEL_2 }}>
                  {formatCurrency(item.totalExpense, currency)}
                </TableCell>
                <TableCell className="text-center" style={{ color: COLORS.DEPS_SUCCESS.LEVEL_2 }}>
                  {formatCurrency(item.totalIncome, currency)}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    style={{
                      color:
                        item.totalIncome - item.totalExpense >= 0
                          ? COLORS.DEPS_INFO.LEVEL_2
                          : COLORS.DEPS_WARNING.LEVEL_2,
                    }}
                  >
                    {formatCurrency(item.totalIncome - item.totalExpense, currency)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableByDate;
