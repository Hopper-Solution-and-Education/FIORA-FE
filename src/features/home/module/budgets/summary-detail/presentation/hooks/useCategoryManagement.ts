import { useState } from 'react';
import { TableData } from '../types/table.type';

export const useCategoryManagement = () => {
  const [categoryRows, setCategoryRows] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const handleAddCategory = (setTableData: React.Dispatch<React.SetStateAction<TableData[]>>) => {
    const newCategoryId = `new-category-${Date.now()}`;
    setCategoryRows((prev) => [...prev, newCategoryId]);

    setTableData((prev) => [
      ...prev.slice(0, 3),
      {
        key: newCategoryId,
        type: '',
        categoryId: '',
        isParent: true,
        action: true,
      },
      ...prev.slice(3),
    ]);
  };

  const handleCategorySelected = (
    categoryId: string,
    selectedCategoryId: string,
    setTableData: React.Dispatch<React.SetStateAction<TableData[]>>,
    categoryName: string,
  ) => {
    setTableData((prev) =>
      prev.map((item) => {
        if (item.key === categoryId) {
          return {
            ...item,
            type: categoryName,
            categoryId: selectedCategoryId,
            children: [
              {
                key: `${selectedCategoryId}-bottom-up`,
                type: 'Bottom-up Plan',
                isChild: true,
                action: true,
                isEditable: true,
              },
              {
                key: `${selectedCategoryId}-actual`,
                type: 'Actual sum-up',
                isChild: true,
                action: true,
                isEditable: false,
              },
            ],
          };
        }
        return item;
      }),
    );
  };

  const handleRemoveCategory = (
    categoryId: string,
    setTableData: React.Dispatch<React.SetStateAction<TableData[]>>,
    tableData: TableData[],
  ) => {
    setCategoryRows((prev) => prev.filter((id) => id !== categoryId));

    const rowData = tableData.find((item) => item.key === categoryId);
    if (rowData?.categoryId) {
      setSelectedCategories((prev) => {
        const next = new Set(prev);
        next.delete(rowData.categoryId);
        return next;
      });
    }

    setTableData((prev) => prev.filter((item) => item.key !== categoryId));
  };

  return {
    categoryRows,
    selectedCategories,
    setSelectedCategories,
    handleAddCategory,
    handleCategorySelected,
    handleRemoveCategory,
  };
};
