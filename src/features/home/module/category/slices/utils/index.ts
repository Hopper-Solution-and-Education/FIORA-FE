import { Category, RawCategory } from '../types';

export const transformCategories = (rawCategories: RawCategory[]): Category[] => {
  const categoryMap = new Map<string, Category>();
  const mainCategories: Category[] = [];

  // Initialize all categories with empty subCategories array
  rawCategories.forEach((raw) => {
    const category: Category = {
      id: raw.id,
      userId: raw.userId,
      type: raw.type,
      icon: raw.icon,
      tax_rate: raw.tax_rate,
      balance: raw.balance,
      name: raw.name,
      subCategories: [],
      description: raw.description ?? undefined,
      parentId: raw.parentId,

      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,

      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
    };
    categoryMap.set(raw.id, category);
  });

  rawCategories.forEach((raw) => {
    const category = categoryMap.get(raw.id)!;

    if (raw.parentId === null || raw.parentId === undefined) {
      // This is a main category
      mainCategories.push(category);
    } else {
      // This is a subcategory, add it to its parent's subCategories
      const parentCategory = categoryMap.get(raw.parentId);
      if (parentCategory) {
        parentCategory.subCategories.push(category);
      }
    }
  });

  return mainCategories;
};
