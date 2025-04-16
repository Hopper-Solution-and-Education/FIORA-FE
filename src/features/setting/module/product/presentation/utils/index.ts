import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';
import { COLORS } from '@/shared/constants/chart';
import { TransactionType } from '@prisma/client';
import { ProductTransactionCategoryResponse } from '../../domain/entities/Product';

export const mapTransactionsToTwoSideBarItems = (
  data: ProductTransactionCategoryResponse[],
): TwoSideBarItem[] => {
  const generateColor = (balance: number, isChild: boolean) => {
    if (balance > 0) {
      return isChild ? COLORS.DEPS_SUCCESS.LEVEL_3 : COLORS.DEPS_SUCCESS.LEVEL_2;
    } else {
      return isChild ? COLORS.DEPS_DANGER.LEVEL_3 : COLORS.DEPS_DANGER.LEVEL_2;
    }
  };

  return data.map((categoryItem) => {
    const catId = categoryItem.category.id;
    let categoryPositive = 0;
    let categoryNegative = 0;

    const children = categoryItem.products.map((item) => {
      let productPositive = 0;
      let productNegative = 0;

      item.transactions?.forEach((tx) => {
        const amount = parseFloat(String(tx?.amount));
        if (tx?.type === TransactionType.Income) {
          productPositive += amount;
          categoryPositive += amount;
        } else if (tx?.type === TransactionType.Expense) {
          productNegative -= amount;
          categoryNegative -= amount;
        }
      });

      return {
        id: item.product.id,
        name: item.product.name,
        positiveValue: productPositive,
        negativeValue: productNegative,
        icon: item.product.icon,
        type: productPositive + productNegative > 0 ? 'income' : 'expense',
        colorPositive: generateColor(productPositive, true),
        colorNegative: generateColor(productNegative, true),
      };
    });

    return {
      id: catId,
      name: categoryItem.category.name,
      positiveValue: categoryPositive,
      negativeValue: categoryNegative,
      icon: categoryItem.category.icon,
      children,
      type: 'category',
      colorPositive: generateColor(categoryPositive, false),
      colorNegative: generateColor(categoryNegative, false),
    };
  });
};
