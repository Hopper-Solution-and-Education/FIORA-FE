/* eslint-disable react-hooks/exhaustive-deps */
import { Icon } from '@/components/common/atoms';
import { TableSkeleton } from '@/components/common/organisms';
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
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';
import { Icons } from '@/components/Icon';
import { ICON_SIZE } from '@/shared/constants/size';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/shared/constants/chart';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { formatCurrency } from '@/shared/utils/convertCurrency';
import { Currency } from '@/shared/types';

type SortConfig = {
  key: 'name' | 'totalIncome' | 'totalExpense';
  direction: 'asc' | 'desc';
};

const TableByAccount = () => {
  const financeByAccount = useAppSelector((state) => state.financeControl.financeByAccount);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedAccounts);
  const dispatch = useAppDispatch();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const currency = useAppSelector((state) => state.settings.currency);
  useEffect(() => {
    if (!isLoading) {
      if (selectedIds.length === 0) {
        dispatch(
          getFinanceByCategoryAsyncThunk({
            type: FinanceReportEnum.ACCOUNT,
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

  const sortedData = [...financeByAccount].sort((a, b) => {
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
    return <TableSkeleton columns={3} rows={5} />;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mt-4">Finance Data by Account</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%]">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Icons.banknote size={ICON_SIZE.SM} />
                  <span>Account Name</span>
                </Button>
              </TableHead>
              <TableHead className="w-[35%] text-center">
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
              <TableHead className="w-[35%] text-center">
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

                <TableCell className="text-center " style={{ color: COLORS.DEPS_SUCCESS.LEVEL_2 }}>
                  {formatCurrency(
                    convertCurrency(item.totalIncome, item.currency as Currency, currency),
                    currency,
                  )}
                </TableCell>

                <TableCell className="text-center " style={{ color: COLORS.DEPS_DANGER.LEVEL_2 }}>
                  {formatCurrency(
                    convertCurrency(item.totalExpense, item.currency as Currency, currency),
                    currency,
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableByAccount;
