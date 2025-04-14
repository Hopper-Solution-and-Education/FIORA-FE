import { COLORS } from '@/shared/constants/chart';
import { TransactionType } from '@prisma/client';
import {
  ProductTransactionCategoryResponse,
  ProductTransactionResponse,
} from '../../domain/entities/Product';
import { BarItem } from '../atoms/charts';

export const mapTransactionsToBarItems = (
  data: ProductTransactionCategoryResponse[],
): BarItem[] => {
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
      const { transactions } = item;

      // Thêm product vào danh sách product của category
      groupedByCategory[catId].products.push(item);

      transactions.forEach((transaction) => {
        const parsedPrice = parseFloat(String(transaction?.amount));
        const type = transaction?.type;

        if (type === TransactionType.Income) {
          groupedByCategory[catId].income += parsedPrice;
          groupedByCategory[catId].color = COLORS.DEPS_SUCCESS.LEVEL_4;
        } else if (type === TransactionType.Expense) {
          groupedByCategory[catId].expense += parsedPrice;
          groupedByCategory[catId].color = COLORS.DEPS_DANGER.LEVEL_4;
        }
      });
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
        children: products.map((item) => {
          const { product, transactions } = item;

          // Tính tổng income & expense từ transaction
          let productIncome = 0;
          let productExpense = 0;

          transactions?.forEach((tx) => {
            const amount = parseFloat(String(tx?.amount));
            if (tx?.type === TransactionType.Income) {
              productIncome += amount;
            } else if (tx?.type === TransactionType.Expense) {
              productExpense += amount;
            }
          });

          return {
            id: product.id,
            name: product.name,
            description: product.description ?? '',
            taxRate: parseFloat(String(product.taxRate)),
            value: parseFloat(String(product.price)),
            icon: product.icon,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            income: productIncome,
            expense: productExpense,
            color:
              productIncome > 0
                ? COLORS.DEPS_SUCCESS.LEVEL_2
                : productExpense > 0
                  ? COLORS.DEPS_DANGER.LEVEL_2
                  : COLORS.DEPS_DANGER.LEVEL_1,
            type: productIncome > 0 ? 'income' : productExpense > 0 ? 'expense' : 'unknown',
            product: {
              id: product.id,
              price: product.price,
              name: product.name,
              type: product.type,
              description: product.description || '',
              items: product.items || [],
              taxRate: product.taxRate || 0,
              catId: product.catId || '',
              icon: product.icon,
            },
            isChild: true,
            parent: catId,
          };
        }),
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
