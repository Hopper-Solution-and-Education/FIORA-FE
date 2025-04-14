import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';
import { COLORS } from '@/shared/constants/chart';
import { TransactionType } from '@prisma/client';
import { ProductTransactionCategoryResponse } from '../../domain/entities/Product';

export const mapTransactionsToTwoSideBarItems = (
  data: ProductTransactionCategoryResponse[],
): TwoSideBarItem[] => {
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
          productNegative += -Math.abs(amount ?? 0);
          categoryNegative += -Math.abs(amount ?? 0);
        }
      });

      return {
        id: item.product.id,
        name: item.product.name,
        positiveValue: productPositive,
        negativeValue: productNegative,
        icon: item.product.icon,
        type: productPositive > 0 ? 'income' : productNegative > 0 ? 'expense' : 'unknown',
        color:
          productPositive > 0
            ? COLORS.DEPS_SUCCESS.LEVEL_2
            : productNegative > 0
              ? COLORS.DEPS_DANGER.LEVEL_2
              : COLORS.DEPS_DANGER.LEVEL_1,
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
      color: categoryPositive > 0 ? COLORS.DEPS_SUCCESS.LEVEL_4 : COLORS.DEPS_DANGER.LEVEL_4,
    };
  });
};
