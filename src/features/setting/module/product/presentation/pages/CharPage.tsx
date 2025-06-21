'use client';

import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';
import PositiveAndNegativeBarChartV2 from '@/components/common/charts/positive-negative-bar-chart-v2';
import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CategoryProduct } from '../../domain/entities';
import {
  setIsOpenDialogAddCategory,
  setProductCategoryFormState,
  setProductCategoryToEdit,
} from '../../slices';
import { mapTransactionsToTwoSideBarItems } from '../utils';
import { FolderOpen } from 'lucide-react';

const ChartPage = () => {
  const data = useAppSelector((state) => state.productManagement.productTransaction.data);
  const router = useRouter();
  const isLoading = useAppSelector(
    (state) => state.productManagement.productTransaction.isLoadingGet,
  );
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const currency = useAppSelector((state) => state.settings.currency);

  const handleEditCategoryProduct = (categoryProduct: CategoryProduct) => {
    dispatch(setProductCategoryFormState('edit'));
    dispatch(setProductCategoryToEdit(categoryProduct));
    dispatch(setIsOpenDialogAddCategory(true));
  };

  const handleCallback = (item: any) => {
    if (!item || !item.id) return;

    if (item.type !== 'category') {
      router.push(`/setting/product/update/${item.id}`);
    } else {
      console.log('item', item);
      const categoryProduct: CategoryProduct = {
        id: item.id ?? '',
        userId: userData?.user.id ?? '',
        icon: item.icon ?? '',
        name: item.name,
        description: item.description,
        taxRate: item.taxRate ?? 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      handleEditCategoryProduct(categoryProduct);
    }
  };

  const chartData = useMemo(
    () => mapTransactionsToTwoSideBarItems(data, currency),
    [currency, data],
  );

  return (
    <div>
      {isLoading ? (
        <ChartSkeleton />
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] my-16 text-center">
          <FolderOpen className="text-gray-500 opacity-80" size={50} strokeWidth={1.5} />
          <p className="text-lg font-medium text-gray-500">No products found.</p>
          <p className="text-sm text-gray-400">Please create a new product to get started.</p>
        </div>
      ) : (
        <PositiveAndNegativeBarChartV2
          data={chartData}
          title="Product Overview"
          levelConfig={{
            totalName: 'Total',
            colorPositive: {
              0: COLORS.DEPS_SUCCESS.LEVEL_1,
              1: COLORS.DEPS_SUCCESS.LEVEL_3,
              2: COLORS.DEPS_SUCCESS.LEVEL_5,
            },
            colorNegative: {
              0: COLORS.DEPS_DANGER.LEVEL_1,
              1: COLORS.DEPS_DANGER.LEVEL_3,
              2: COLORS.DEPS_DANGER.LEVEL_5,
            },
          }}
          legendItems={[
            { name: 'Expense (Category)', color: COLORS.DEPS_DANGER.LEVEL_1 },
            { name: 'Income (Category)', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
            { name: 'Expense (Product)', color: COLORS.DEPS_DANGER.LEVEL_3 },
            { name: 'Income (Product)', color: COLORS.DEPS_SUCCESS.LEVEL_3 },
          ]}
          showTotal
          totalName="Total Transaction"
          callback={handleCallback}
          currency={currency}
          xAxisFormatter={(value) => formatCurrency(value, currency)}
        />
      )}
    </div>
  );
};

export default ChartPage;
