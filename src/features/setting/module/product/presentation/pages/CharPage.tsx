'use client';

import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';
import { COLORS } from '@/shared/constants/chart';
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
import PositiveAndNegativeBarChartV2 from '@/components/common/positive-negative-bar-chart-v2';

const ChartPage = () => {
  const data = useAppSelector((state) => state.productManagement.productTransaction.data);
  const router = useRouter();
  const isLoading = useAppSelector(
    (state) => state.productManagement.productTransaction.isLoadingGet,
  );
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();

  const handleEditCategoryProduct = (categoryProduct: CategoryProduct) => {
    dispatch(setProductCategoryFormState('edit'));
    dispatch(setProductCategoryToEdit(categoryProduct));
    dispatch(setIsOpenDialogAddCategory(true));
  };

  const tryCallBackYaxis = (item: any) => {
    if (item.type === 'product') {
      router.push(`/setting/product/update/${item.id}`);
    } else {
      const categoryProduct: CategoryProduct = {
        id: item.id ?? '',
        userId: userData?.user.id ?? '',
        icon: item.icon ?? '',
        name: item.name,
        description: '',
        taxRate: 0,
        createdAt: '',
        updatedAt: '',
      };
      handleEditCategoryProduct(categoryProduct);
    }
  };

  const chartData = useMemo(() => mapTransactionsToTwoSideBarItems(data), [data]);

  return (
    <div>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <PositiveAndNegativeBarChartV2
          data={chartData}
          title="Product Overview"
          legendItems={[
            { name: 'Expense (Category)', color: COLORS.DEPS_DANGER.LEVEL_2 },
            { name: 'Income (Category)', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
            { name: 'Expense (Product)', color: COLORS.DEPS_DANGER.LEVEL_3 },
            { name: 'Income (Product)', color: COLORS.DEPS_SUCCESS.LEVEL_3 },
          ]}
          showTotal
          totalName="Total Transaction"
          callbackYAxis={tryCallBackYaxis}
        />
      )}
    </div>
  );
};

export default ChartPage;
