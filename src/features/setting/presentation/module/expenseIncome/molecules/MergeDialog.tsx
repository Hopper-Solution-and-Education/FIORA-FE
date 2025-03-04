import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SubCategoryList from '../organisms/SubCategoryList';

interface MergeDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  selectedCategory: any;
  setSelectedCategory: (category: any) => void;
  newCategory: any;
  setNewCategory: (category: any) => void;
  handleCreateOrUpdateCategory: () => void;
}

const MergeDialog: React.FC<MergeDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  selectedCategory,
  setSelectedCategory,
  newCategory,
  setNewCategory,
  handleCreateOrUpdateCategory,
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Category Name"
          value={selectedCategory?.name || newCategory.name}
          onChange={(e) =>
            selectedCategory
              ? setSelectedCategory({ ...selectedCategory, name: e.target.value })
              : setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <SubCategoryList
          subCategories={
            selectedCategory ? selectedCategory.subCategories : newCategory.subCategories
          }
          editable
        />
        <DialogFooter>
          <Button onClick={handleCreateOrUpdateCategory}>
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MergeDialog;
