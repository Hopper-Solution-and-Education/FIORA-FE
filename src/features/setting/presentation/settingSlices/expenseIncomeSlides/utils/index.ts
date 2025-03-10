import { Category, RawCategory } from '../types';

export const transformCategories = (rawCategories: RawCategory[]): Category[] => {
  const categoryMap = new Map<string, Category>();
  const mainCategories: Category[] = [];

  // Initialize all categories with empty subCategories array
  rawCategories.forEach((raw) => {
    const category: Category = {
      id: raw.id,
      name: raw.name,
      type: raw.type,
      subCategories: [],
      description: raw.description ?? undefined,
      icon: raw.icon,
      parentId: raw.parentId,
      userId: raw.userId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
    categoryMap.set(raw.id, category);
  });

  rawCategories.forEach((raw) => {
    const category = categoryMap.get(raw.id)!;

    if (raw.parentId === null) {
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
