import { CategoryType } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const defaultExpenseCategories = [
  {
    name: 'Food and Drink',
    icon: 'utensils',
    type: CategoryType.Expense,
  },
  {
    name: 'Stay and Rest',
    icon: 'home',
    type: CategoryType.Expense,
  },
  {
    name: 'Transport',
    icon: 'car',
    type: CategoryType.Expense,
  },
  {
    name: 'Connect',
    icon: 'phone',
    type: CategoryType.Expense,
  },
];

export const defaultIncomeCategories = [
  {
    name: 'Salary',
    icon: 'banknote',
    type: CategoryType.Income,
  },
  {
    name: 'Selling',
    icon: 'shoppingCart',
    type: CategoryType.Income,
  },
  {
    name: 'Saving',
    icon: 'piggyBank',
    type: CategoryType.Income,
  },
  {
    name: 'Invest',
    icon: 'trendingUp',
    type: CategoryType.Income,
  },
];

export async function createDefaultCategories(userId: string) {
  try {
    // Create expense categories
    await Promise.all(
      defaultExpenseCategories.map((category) =>
        prisma.category.create({
          data: {
            ...category,
            userId,
            createdBy: userId,
          },
        }),
      ),
    );

    // Create income categories
    await Promise.all(
      defaultIncomeCategories.map((category) =>
        prisma.category.create({
          data: {
            ...category,
            userId,
            createdBy: userId,
          },
        }),
      ),
    );

    return true;
  } catch (error) {
    console.error('Error creating default categories:', error);
    return false;
  }
}
