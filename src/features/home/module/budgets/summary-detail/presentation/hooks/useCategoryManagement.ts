import { useState } from 'react';
import { BudgetDetailFilterType, TableData } from '../types/table.type';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { DeleteCategoryRequestDTO } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { toast } from 'sonner';

interface UseCategoryManagementProps {
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  setTableData: React.Dispatch<React.SetStateAction<TableData[]>>;
  tableData: TableData[];
  activeTab: BudgetDetailFilterType;
  initialYear: number;
}

export const useCategoryManagement = ({
  budgetSummaryUseCase,
  setTableData,
  tableData,
  activeTab,
  initialYear,
}: UseCategoryManagementProps) => {
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

  const handleRemoveCategory = (categoryId: string) => {
    setCategoryRows((prev) => {
      return prev.filter((id) => id !== categoryId);
    });

    const rowData = tableData.find((item) => item?.categoryId === categoryId);

    if (rowData?.categoryId) {
      setSelectedCategories((prev) => {
        const next = new Set(prev);
        next.delete(rowData.categoryId);
        return next;
      });
    }

    setTableData((prev) => {
      const newTableData = prev.filter((item) => item?.categoryId !== categoryId);
      return newTableData;
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const type = activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';

      const deleteData: DeleteCategoryRequestDTO = {
        fiscalYear: initialYear.toString(),
        type: type,
        categoryId: categoryId,
      };

      await budgetSummaryUseCase.deleteCategory(deleteData);

      toast.success('Category deleted successfully');
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
