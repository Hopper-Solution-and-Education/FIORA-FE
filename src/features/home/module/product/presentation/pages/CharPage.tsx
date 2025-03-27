'use client';

import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductTransactionResponse } from '../../domain/entities/Product';
import { setDialogState, toggleDialogAddEdit } from '../../slices';
import TwoSideBarChart, { BarItem } from '../atoms/charts';
import { ProductFormValues } from '../schema/addProduct.schema';
import { LoadingIndicator } from '@/components/common/atoms/LoadingIndicator';

const mapTransactionsToBarItems = (data: ProductTransactionResponse[]): BarItem[] => {
  const groupedData: Record<string, BarItem> = {};

  data.forEach((item) => {
    const { transaction, product } = item;
    const { name, price } = product;
    const type = transaction.type.toLowerCase();
    const parsedPrice = parseFloat(String(price));

    if (!groupedData[name]) {
      groupedData[name] = {
        id: product.id,
        name: product.name,
        value: 0, // Giá trị này chỉ placeholder, thực tế dùng income & expense
        type: 'product',
        product: {
          categoryId: product.catId,
          icon: product.icon,
          id: product.id,
          name: product.name,
          price: product.price,
          type: product.type,
          description: product.description,
          items: product.items,
          taxRate: product.taxRate,
        },
        income: 0,
        expense: 0,
      };
    }

    if (type === 'income') {
      groupedData[name].income! += parsedPrice;
    } else if (type === 'expense') {
      groupedData[name].expense! += parsedPrice;
    }
  });

  return Object.values(groupedData).flatMap(({ id, name, income, expense, product }) => {
    const items: BarItem[] = [];
    if (income! > 0) {
      items.push({ id, name, value: income!, type: 'income', product });
    }
    if (expense! > 0) {
      items.push({ id, name, value: expense!, type: 'expense', product });
    }
    return items;
  });
};

type ChartPageProps = {
  method: UseFormReturn<ProductFormValues>;
};

const ChartPage = ({ method }: ChartPageProps) => {
  const { reset } = method;

  const dispatch = useAppDispatch();

  const handleEditProduct = (product: ProductFormValues) => {
    console.log(product);

    dispatch(setDialogState('edit'));
    reset({
      categoryId: product.categoryId,
      icon: product.icon,
      name: product.name,
      price: product.price,
      description: product.description,
      id: product.id,
      type: product.type,
      items: product.items?.map((item) => ({
        description: item.description,
        name: item.name,
      })),
      taxRate: Number(product.taxRate),
    });
    dispatch(toggleDialogAddEdit(true));
  };

  const data = useAppSelector((state) => state.productManagement.productTransaction.data);
  const isLoading = useAppSelector(
    (state) => state.productManagement.productTransaction.isLoadingGet,
  );

  const tryCallback = (item: any) => {
    handleEditProduct(item.payload.product);
  };

  const tryCallBackYaxis = (item: any) => {
    handleEditProduct(item.product);
  };

  const chartData = useMemo(() => mapTransactionsToBarItems(data), [data]);

  return (
    <div className="p-4">
      {isLoading && <LoadingIndicator />}
      <TwoSideBarChart
        data={chartData}
        title="Product Overview"
        legendItems={[
          { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
          { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
        ]}
        callback={tryCallback}
        callbackYAxis={tryCallBackYaxis}
      />
    </div>
  );
};

export default ChartPage;
