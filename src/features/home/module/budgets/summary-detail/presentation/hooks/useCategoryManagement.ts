import { useState } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { DeleteCategoryRequestDTO } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { BudgetDetailFilterType, BudgetInit, TableData } from '../types/table.type';

interface UseCategoryManagementProps {
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  activeTab: BudgetDetailFilterType;
  initialYear: number;
  table: BudgetInit<TableData>;
}

export const useCategoryManagement = ({
  budgetSummaryUseCase,
  activeTab,
  initialYear,
  table,
}: UseCategoryManagementProps) => {
  const [categoryRows, setCategoryRows] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const handleAddCategory = () => {
    const hasUnselectedCategory = table.data.some(
      (item) => categoryRows.includes(item.key) && !item.categoryId,
    );

    if (hasUnselectedCategory) {
      toast.error('Please select a category before adding a new one.');
      return;
    }

    const newCategoryId = `new-category-${Date.now()}`;
    setCategoryRows((prev) => [...prev, newCategoryId]);

    table.set((prev) => [
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

  const handleRemoveCategory = (categoryId: string) => {
    setCategoryRows((prev) => {
      return prev.filter((id) => id !== categoryId);
    });

    const rowData = table.data.find((item) => item?.categoryId === categoryId);

    if (rowData?.categoryId) {
      setSelectedCategories((prev) => {
        const next = new Set(prev);
        next.delete(rowData.categoryId);
        return next;
      });
    }

    table.set((prev) => {
      const newTableData = prev.filter((item) => item?.categoryId !== categoryId);
      return newTableData;
    });
  };

  const handleDeleteCategory = async (categoryId: string, isTruncate: boolean = true) => {
    try {
      const type = activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';

      const deleteData: DeleteCategoryRequestDTO = {
        fiscalYear: initialYear.toString(),
        type: type,
        categoryId: categoryId,
        isTruncate,
      };

      await budgetSummaryUseCase.deleteCategory(deleteData);

      if (isTruncate) {
        toast.success('Category reseted successfully');
      } else {
        toast.success('Category deleted successfully');
      }

      table.fetch();
    } catch (error: any) {
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };

  return {
    categoryRows,
    selectedCategories,
    setSelectedCategories,
    handleAddCategory,
    handleCategorySelected,
    handleRemoveCategory,
    handleDeleteCategory,
  };
};
