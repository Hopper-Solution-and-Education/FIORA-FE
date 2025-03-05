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

interface CategoryTableProps {
  categories: Category[];
  type: string;
  setSelectedCategory: (cat: Category | null) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setDialogOpen: (open: boolean) => void;
  setSelectedMainCategory: (cat: Category | null) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  type,
  setSelectedCategory,
  setDeleteConfirmOpen,
  setDialogOpen,
  setSelectedMainCategory,
}) => {
  const handleCategoryClick = (category: Category) => {
    setSelectedMainCategory(category);
  };

  if (!categories || categories.length === 0) {
    return <div>No data</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Sub-Categories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories
          .filter((category) => category.type === type)
          .map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="text-blue-600 hover:underline"
                >
                  {category.name}
                </button>
              </TableCell>
              <TableCell>
                <SubCategoryList subCategories={category.subCategories} />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
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
                    setSelectedCategory(category);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
