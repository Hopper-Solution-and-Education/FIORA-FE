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
import { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';
import { Icon } from '@/components/common/atoms';

const TableByPartner = () => {
  const financeByPartner = useAppSelector((state) => state.financeControl.financeByPartner);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedPartners);
  const dispatch = useAppDispatch();

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
              <TableHead className="w-[60%]">Partner Name</TableHead>
              <TableHead className="w-[40%] text-right">Expense</TableHead>
              <TableHead className="w-[40%] text-right">Income</TableHead>
              <TableHead className="w-[40%] text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financeByPartner.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <Icon icon={item.logo ?? ''} />
                    </div>
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-red-600">
                  {item.totalExpense.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell className="text-green-600">
                  {item.totalIncome.toLocaleString('vi-VN')} VNĐ
                </TableCell>
                <TableCell>
                  <span className={item.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {item.totalProfit.toLocaleString('vi-VN')} VNĐ
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
