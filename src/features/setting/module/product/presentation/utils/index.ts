import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';
import { generateColor } from '@/shared/lib/charts';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { TransactionType } from '@prisma/client'; // Import Currency and Prisma
import { ProductTransactionCategoryResponse } from '../../domain/entities/Product';

type Currency = 'VND' | 'USD'; // This line might not be needed if imported from @prisma/client

export const mapTransactionsToTwoSideBarItems = (
  data: ProductTransactionCategoryResponse[],
  targetCurrency: Currency, // currency target to exchange
): TwoSideBarItem[] => {
  return data.map((categoryItem) => {
    const catId = categoryItem.category.id;
    let categoryPositive = 0;
    let categoryNegative = 0;

    const children = categoryItem.products.map((item) => {
      let productPositive = 0;
      let productNegative = 0;

      item.transactions?.forEach((tx) => {
        // --- MODIFICATION START ---
        // Ensure tx.amount and tx.currency exist and are valid
        if (tx?.amount !== undefined && tx?.currency !== undefined && tx?.type !== undefined) {
          // Convert the amount to the target currency
          const convertedAmount = convertCurrency(
            tx.amount, // Pass the amount (can be Decimal or number)
            tx.currency as Currency, // Pass the original currency (assuming tx.currency exists)
            targetCurrency, // Pass the target currency from function params
          );

          if (tx.type === TransactionType.Income) {
            productPositive += convertedAmount;
            categoryPositive += convertedAmount;
          } else if (tx.type === TransactionType.Expense) {
            // For expenses, still add a negative value after conversion
            productNegative -= convertedAmount;
            categoryNegative -= convertedAmount;
          }
        }
        // --- MODIFICATION END ---
      });

      return {
        id: item.product.id,
        name: item.product.name,
        positiveValue: productPositive,
        negativeValue: productNegative,
        icon: item.product.icon,
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
      children,
      type: 'category',
      // Pass the aggregate values to generateColor
      colorPositive: generateColor(categoryPositive, false),
      colorNegative: generateColor(categoryNegative, false),
    };
  });
};
