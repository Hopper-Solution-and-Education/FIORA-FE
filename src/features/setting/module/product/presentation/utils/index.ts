import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { generateColor } from '@/shared/lib/charts';
import { ExchangeAmountParams, ExchangeAmountResult } from '@/shared/types';
import { TransactionType } from '@prisma/client'; // Import Currency and Prisma
import { ProductTransactionCategoryResponse } from '../../domain/entities/Product';

export const mapTransactionsToTwoSideBarItems = (
  data: ProductTransactionCategoryResponse[],
  targetCurrency: string,
  getExchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult,
): TwoSideBarItem[] => {
  return data.map((categoryItem) => {
    const catId = categoryItem.category.id;
    let categoryPositive = 0;
    let categoryNegative = 0;

    const children = categoryItem.products.map((item) => {
      let productPositive = 0;
      let productNegative = 0;

      item.transactions?.forEach(async (tx) => {
        // --- MODIFICATION START ---
        // Ensure tx.amount and tx.currency exist and are valid
        if (
          tx?.baseAmount !== undefined &&
          tx?.baseCurrency !== undefined &&
          tx?.type !== undefined
        ) {
          const formattedAmount = getExchangeAmount({
            amount: tx.baseAmount,
            fromCurrency: tx.baseCurrency,
            toCurrency: targetCurrency,
          }).convertedAmount;
          if (tx.type === TransactionType.Income) {
            productPositive += Number(formattedAmount || 0);
            categoryPositive += Number(formattedAmount || 0);
          } else if (tx.type === TransactionType.Expense) {
            // For expenses, still add a negative value after conversion
            productNegative -= Number(formattedAmount || 0);
            categoryNegative -= Number(formattedAmount || 0);
          }
        }
        // --- MODIFICATION END ---
      });

      return {
        id: item.id,
        name: item.name,
        positiveValue: productPositive,
        negativeValue: productNegative,
        icon: item.icon,
        type: productPositive + productNegative > 0 ? 'income' : 'expense',
        // Pass the aggregate values to generateColor
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
      taxRate: categoryItem.category.tax_rate,
      createdAt: categoryItem.category.createdAt,
      updatedAt: categoryItem.category.updatedAt,
      description: categoryItem.category.description,
      children,
      type: 'category',
      // Pass the aggregate values to generateColor
      colorPositive: generateColor(categoryPositive, false),
      colorNegative: generateColor(categoryNegative, false),
    };
  });
};
