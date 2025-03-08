import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SubCategoryRow from '@/features/setting/presentation/module/expenseIncome/molecules/SubCategoryRow';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect, useState } from 'react';
import { Category } from '../../../settingSlices/expenseIncomeSlides/types';
import { CategoryType } from '@prisma/client';
import InsertCategoryDialog from '@/features/setting/presentation/module/expenseIncome/molecules/InsertCategoryDialog';
import { createCategory } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { setDialogOpen } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';

interface CategoryTableProps {
  setSelectedCategory: (cat: Category | null) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  setSelectedCategory,
  setDeleteConfirmOpen,
}) => {
  const dispatch = useAppDispatch();
  const { selectedCategory, dialogOpen } = useAppSelector((state) => state.expenseIncome);

  const [subCategoryList, setSubCategoryList] = useState(selectedCategory?.subCategories); // Temporary state for subcategories

  const handleCreateCategory = (category: Partial<Category>) => {
    dispatch(
      createCategory({
        name: category.name || '',
        type: selectedCategory!.type as CategoryType,
        subCategories: [],
        icon: category.icon || '',
        parentId: selectedCategory?.id,
      }),
    );
    dispatch(setDialogOpen(false));
  };

  useEffect(() => {
    setSubCategoryList(selectedCategory?.subCategories);
  }, [selectedCategory?.subCategories]);

  // Handle name/icon change for subcategory
  const handleChangeSubCategory = (id: string, field: 'name' | 'icon', value: string) => {
    if (!subCategoryList) return;
    const updatedList = subCategoryList.map((sub: Category) =>
      sub.id === id ? { ...sub, [field]: value } : sub,
    );
    setSubCategoryList(updatedList);
  };

  const handleRemoveSubCategory = (id: string) => {
    if (!subCategoryList) return;
    const updatedList = subCategoryList.filter((sub) => sub.id !== id);
    setSubCategoryList(updatedList);
  };

  if (!selectedCategory) {
    return <div>No data</div>;
  }

  return (
    <>
      <Table>
        <TableHeader className="w-full">
          <TableRow>
            <TableHead>Sub-Categories</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="w-full">
          {selectedCategory &&
            selectedCategory.subCategories &&
            selectedCategory.subCategories.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <SubCategoryRow
                    subCatory={sub}
                    handleChangeSubCategory={handleChangeSubCategory}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex w-1/5 gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 flex-1"
                      onClick={() => handleRemoveSubCategory(sub.id)}
                    >
                      <Icons.trash />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-500 flex-1"
                      onClick={() => handleRemoveSubCategory(sub.id)}
                    >
                      <Icons.save />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Button
        size="sm"
        variant="outline"
        onClick={() => dispatch(setDialogOpen(true))}
        className="mt-2"
      >
        + Add Subcategory
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500"
        onClick={() => {
          setSelectedCategory(selectedCategory);
          setDeleteConfirmOpen(true);
        }}
      >
        Delete
      </Button>

      <InsertCategoryDialog
        title={`Add Subcategory for ${selectedCategory.name}`}
        dialogOpen={dialogOpen}
        setDialogOpen={(open) => dispatch(setDialogOpen(open))}
        handleCreateCategory={handleCreateCategory}
        parentId={selectedCategory.id}
      />
    </>
  );
};

export default CategoryTable;
