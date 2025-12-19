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
import { COLORS, ICON_SIZE } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';

type SortConfig = {
  key: 'name' | 'totalExpense' | 'totalIncome' | 'totalProfit';
  direction: 'asc' | 'desc';
};

const TableByPartner = () => {
  const financeByPartner = useAppSelector((state) => state.financeControl.financeByPartner);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedPartners);
  const dispatch = useAppDispatch();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'desc' });
  const { formatCurrency } = useCurrencyFormatter();

  useEffect(() => {
    if (!isLoading) {
      if (selectedIds.length === 0) {
        dispatch(
          getFinanceByCategoryAsyncThunk({
            type: FinanceReportEnum.PARTNER,
            filter: FinanceReportFilterEnum.ALL,
          }),
        );
      }
    }
  }, [dispatch, selectedIds]);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = [...financeByPartner].sort((a, b) => {
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
    return <TableSkeleton columns={4} rows={5} />;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mt-4">Finance Data by Partner</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Icons.users size={ICON_SIZE.SM} />
                  <span>Partner Name</span>
                </Button>
              </TableHead>
              <TableHead className="w-[20%]">
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
              <TableHead className="w-[20%]">
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
              <TableHead className="w-[20%]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort('totalProfit')}
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
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon icon={item.logo ?? ''} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center" style={{ color: COLORS.DEPS_DANGER.LEVEL_2 }}>
                  {formatCurrency(item.totalExpense, item.currency)}
                </TableCell>
                <TableCell className="text-center" style={{ color: COLORS.DEPS_SUCCESS.LEVEL_2 }}>
                  {formatCurrency(item.totalIncome, item.currency)}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    style={{
                      color:
                        item.totalProfit >= 0
                          ? COLORS.DEPS_SUCCESS.LEVEL_2
                          : COLORS.DEPS_DANGER.LEVEL_2,
                    }}
                  >
                    {formatCurrency(item.totalProfit, item.currency)}
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

export default TableByPartner;
