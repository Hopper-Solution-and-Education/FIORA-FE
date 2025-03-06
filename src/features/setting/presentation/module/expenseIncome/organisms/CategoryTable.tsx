import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category } from '../../../settingSlices/expenseIncomeSlides/types';
import SubCategoryList from './SubCategoryList';
import { useAppSelector } from '@/store';

interface CategoryTableProps {
  setSelectedCategory: (cat: Category | null) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setDialogOpen: (open: boolean) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  setSelectedCategory,
  setDeleteConfirmOpen,
  setDialogOpen,
}) => {
  const { selectedCategory } = useAppSelector((state) => state.expenseIncome);

  if (!selectedCategory) {
    return <div>No data</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sub-Categories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow key={selectedCategory.id}>
          <TableCell>
            <SubCategoryList subCategories={selectedCategory.subCategories} editable={true} />
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory(selectedCategory);
                setDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500"
              onClick={() => {
                // handleDeleteCategory(category.id); // Delete category
              }}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
