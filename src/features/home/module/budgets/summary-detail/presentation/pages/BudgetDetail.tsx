'use client';

import { CustomTable } from '@/components/common/tables/custom-table';
import { useAppSelector } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BudgetDetailType } from '../../utils/budgetDetailUtils';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { BudgetType } from '../../domain/entities/BudgetType';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { TableData, getColumnsByPeriod, getTableDataByPeriod } from '../../utils/budgetDetailUtils';

interface BudgetDetailProps {
  year: string;
}

const BudgetDetail = ({ year }: BudgetDetailProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency } = useAppSelector((state) => state.settings);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columns, setColumns] = useState<any[]>([]);

  const period = searchParams?.get('period') || BudgetDetailType.YEAR;
  const periodId = searchParams?.get('periodId') || 'year';

  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );

  const fetchBudgetData = async () => {
    if (!year) {
      toast.error('Invalid parameters');
      router.push('/budgets');
      return;
    }

    setIsLoading(true);
    try {
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(Number(year), BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(Number(year), BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(Number(year), BudgetType.Act),
      ]);

      // Lấy dữ liệu cho bảng dựa trên loại kỳ
      const data = getTableDataByPeriod(top, bot, act);
      setTableData(data);

      // Lấy các cột hiển thị dựa trên loại kỳ
      const cols = getColumnsByPeriod(period, periodId, currency);
      setColumns(cols);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget data';
      toast.error(errorMessage);
      router.push('/budgets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [year, period, periodId, currency]);

  // Hàm lấy tiêu đề hiển thị dựa trên loại kỳ
  const getDisplayTitle = () => {
    switch (period) {
      case BudgetDetailType.MONTH: {
        const monthIndex = parseInt(periodId.split('-')[1]) - 1; // Line 74
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]; // Line 75
        return `${monthNames[monthIndex]} (${year})`;
      }

      case BudgetDetailType.QUARTER: {
        const quarterIndex = parseInt(periodId.split('-')[1]); // Line 92
        return `Quarter ${quarterIndex} (${year})`;
      }

      case BudgetDetailType.HALF_YEAR: {
        const halfYearIndex = parseInt(periodId.split('-')[1]); // Line 96
        return `Half Year ${halfYearIndex} (${year})`;
      }

      case BudgetDetailType.YEAR:
      default: {
        return `Full Year (${year})`;
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Budget Detail - {getDisplayTitle()}</h1>
      <CustomTable
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        rowKey="key"
        bordered
        layoutBorder
        showHeader
        rowHover
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default BudgetDetail;
