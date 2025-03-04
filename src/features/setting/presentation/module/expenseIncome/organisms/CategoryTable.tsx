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
import { CategoryType } from '../../../types';
import SubCategoryList from './SubCategoryList';

interface CategoryTableProps {
  categories: CategoryType[];
  type: string;
  setSelectedCategory: (category: any) => void;
  setDeleteConfirmOpen: (open: boolean) => void;
  setDialogOpen: (open: boolean) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  type,
  setSelectedCategory,
  setDeleteConfirmOpen,
  setDialogOpen,
}) => {
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
              <TableCell>{category.name}</TableCell>
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
