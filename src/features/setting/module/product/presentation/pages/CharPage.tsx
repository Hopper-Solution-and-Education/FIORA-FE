'use client';

import Loading from '@/components/common/atoms/Loading';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { ArrowDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { CategoryProduct } from '../../domain/entities/Category';
import {
  ProductTransactionCategoryResponse,
  ProductTransactionResponse,
} from '../../domain/entities/Product';
import {
  setIsOpenDialogAddCategory,
  setProductCategoryFormState,
  setProductCategoryToEdit,
} from '../../slices';
import { getProductTransactionAsyncThunk } from '../../slices/actions/getProductTransactionAsyncThunk';
import TwoSideBarChart, { BarItem } from '../atoms/charts';

// Hàm mapping dữ liệu thành BarItem
const mapTransactionsToBarItems = (data: ProductTransactionCategoryResponse[]): BarItem[] => {
  const groupedByCategory: Record<
    string,
    {
      id: string;
      name: string;
      description: string;
      taxRate: number;
      income: number;
      expense: number;
      icon: string;
      color: string;
      products: ProductTransactionResponse[];
      createdAt: string;
      updatedAt: string;
    }
  > = {};

  // Nhóm theo danh mục
  data.forEach((categoryItem) => {
    const catId = categoryItem.category.id;
    const categoryName = categoryItem.category.name;

    if (!groupedByCategory[catId]) {
      groupedByCategory[catId] = {
        name: categoryName,
        id: catId,
        description: categoryItem.category.description || '',
        taxRate: categoryItem.category.taxRate || 0,
        income: 0,
        expense: 0,
        icon: categoryItem.category.icon,
        color: COLORS.DEPS_SUCCESS.LEVEL_2,
        products: [],
        createdAt: categoryItem.category.createdAt,
        updatedAt: categoryItem.category.updatedAt,
      };
    }

    categoryItem.products.forEach((item) => {
      const { transaction, product } = item;
      const parsedPrice = parseFloat(String(product.price));
      const type = transaction?.type.toLowerCase();

      groupedByCategory[catId].products.push(item);

      if (type === 'income') {
        groupedByCategory[catId].income += parsedPrice;
        groupedByCategory[catId].color = COLORS.DEPS_SUCCESS.LEVEL_4;
      } else if (type === 'expense') {
        groupedByCategory[catId].expense += parsedPrice;
        groupedByCategory[catId].color = COLORS.DEPS_DANGER.LEVEL_4;
      }
    });
  });

  return Object.entries(groupedByCategory).flatMap(
    ([
      catId,
      { name, income, expense, products, icon, description, taxRate, createdAt, updatedAt, color },
    ]) => {
      const categoryItem: BarItem = {
        id: catId,
        name,
        value: 0,
        type: 'category',
        description,
        taxRate,
        income,
        icon,
        color,
        expense,
        createdAt,
        updatedAt,
        children: products.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          description: item.product.description ?? '',
          taxRate: parseFloat(String(item.product.taxRate)),
          value: parseFloat(String(item.product.price)),
          icon: item.product.icon,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
          expense: 0,
          income: 0,
          color: COLORS.DEPS_SUCCESS.LEVEL_2,
          children: [],
          depth: 0,
          type: item.transaction?.type.toLowerCase() || 'unknown',
          product: {
            id: item.product.id,
            price: item.product.price,
            name: item.product.name,
            type: item.product.type,
            description: item.product.description || '',
            items: item.product.items || [],
            taxRate: item.product.taxRate || 0,
            catId: item.product.catId || '',
            icon: item.product.icon,
          },
          isChild: true,
          parent: catId,
        })),
      };

      // Tạo BarItem cho income và expense, ngay cả khi giá trị là 0
      const items: BarItem[] = [
        { ...categoryItem, value: income, type: 'income' },
        { ...categoryItem, value: expense, type: 'expense' },
      ];

      return items;
    },
  );
};

const ChartPage = () => {
  const data = useAppSelector((state) => state.productManagement.productTransaction.data);
  const router = useRouter();

  const isLoading = useAppSelector(
    (state) => state.productManagement.productTransaction.isLoadingGet,
  );
  const { page, pageSize, hasMore } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );

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

  const loadMoreTransactionProduct = () => {
    if (hasMore) {
      dispatch(
        getProductTransactionAsyncThunk({
          page: page + 1,
          pageSize,
          userId: userData?.user.id ?? '',
        }),
      );
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
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
      <div className="w-full text-center">
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
      </div>
    </div>
  );
};

export default ChartPage;
