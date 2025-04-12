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
import { BarItem, TwoSideBarChart } from '../atoms/charts';
import { mapTransactionsToBarItems } from '../utils';

// Hàm mapping dữ liệu thành BarItem

const ChartPage = () => {
  const data = useAppSelector((state) => state.productManagement.productTransaction.data);
  const router = useRouter();

  const isLoading = useAppSelector(
    (state) => state.productManagement.productTransaction.isLoadingGet,
  );
  // const { page, pageSize, hasMore } = useAppSelector(
  //   (state) => state.productManagement.productTransaction,
  // );

  const dispatch = useAppDispatch();
  const { data: userData } = useSession();

  const handleEditCategoryProduct = (categoryProduct: CategoryProduct) => {
    dispatch(setProductCategoryFormState('edit'));
    dispatch(setProductCategoryToEdit(categoryProduct));
    dispatch(setIsOpenDialogAddCategory(true));
  };

  const tryCallBackYaxis = (item: BarItem) => {
    if (item.product) {
      router.push(`/setting/product/update/${item.product.id}`);
    } else {
      const categoryProduct: CategoryProduct = {
        id: item.id ?? '',
        userId: userData?.user.id ?? '',
        icon: item.icon ?? '',
        name: item.name,
        description: item.description,
        taxRate: item.taxRate,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      handleEditCategoryProduct(categoryProduct);
    }
  };

  const chartData = useMemo(() => mapTransactionsToBarItems(data), [data]);

  // const loadMoreTransactionProduct = () => {
  //   if (hasMore) {
  //     dispatch(
  //       getProductTransactionAsyncThunk({
  //         page: page + 1,
  //         pageSize,
  //         userId: userData?.user.id ?? '',
  //       }),
  //     );
  //   }
  // };

  return (
    <div>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <>
          <TwoSideBarChart
            data={chartData}
            title="Product Overview"
            legendItems={[
              { name: 'Expense (Category)', color: COLORS.DEPS_DANGER.LEVEL_2 },
              { name: 'Income (Category)', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
              { name: 'Expense (Product)', color: COLORS.DEPS_DANGER.LEVEL_3 },
              { name: 'Income (Product)', color: COLORS.DEPS_SUCCESS.LEVEL_3 },
            ]}
            levelConfig={{
              totalName: 'Total Transaction',
              colors: {
                0: COLORS.DEPS_SUCCESS.LEVEL_3,
              },
            }}
            callbackYAxis={(e) => tryCallBackYaxis(e)}
          />
          {/* <div className="w-full text-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!hasMore}
                    onClick={loadMoreTransactionProduct}
                    className="p-2 sm:p-3 md:p-4"
                  >
                    <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Load More</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div> */}
        </>
      )}
    </div>
  );
};

export default ChartPage;
