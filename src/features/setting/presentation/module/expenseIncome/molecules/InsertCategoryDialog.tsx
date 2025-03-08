'use client';
import IconSelect from '@/components/common/IconSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { iconOptions } from '@/shared/constants/data';
import { CategoryType } from '@prisma/client';
import React, { useState } from 'react';
import { Category } from '../../../settingSlices/expenseIncomeSlides/types';

interface InsertCategoryDialogProps {
  title?: string;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleCreateCategory: (category: Partial<Category>) => void;
  parentId?: string | null;
}

interface NewCategory {
  name: string;
  type: CategoryType;
  icon: string;
  parentId?: string | null;
}

const InsertCategoryDialog: React.FC<InsertCategoryDialogProps> = ({
  title,
  dialogOpen,
  setDialogOpen,
  handleCreateCategory,
  parentId,
}) => {
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    type: CategoryType.Expense,
    icon: iconOptions[0].options[0].value,
  });

  const handleCreate = () => {
    handleCreateCategory(newCategory);
    setDialogOpen(false);
    setNewCategory({
      name: '',
      type: CategoryType.Expense,
      icon: iconOptions[0].options[0].value,
      parentId: parentId || null,
    });
  };

  const handleCloseDialog = (e: boolean) => {
    setDialogOpen(e);
    setNewCategory({
      name: '',
      type: CategoryType.Expense,
      icon: iconOptions[0].options[0].value,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedIcon, setSelectedIcon] = useState(newCategory?.icon || 'trash');

  return (
    <Dialog open={dialogOpen} onOpenChange={(e) => handleCloseDialog(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ? title : 'Create New Category'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Name Input */}
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />

          {/* Icon Selector */}
          <IconSelect
            selectedIcon={selectedIcon}
            onIconChange={(value) => setNewCategory({ ...newCategory, icon: value })}
          />

          {/* Category Type Radio Group */}
          <RadioGroup
            defaultValue={CategoryType.Expense}
            className="flex gap-2"
            onValueChange={(e) => setNewCategory({ ...newCategory, type: e as CategoryType })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={CategoryType.Expense} id="r2" />
              <Label htmlFor="r2">Expense</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={CategoryType.Income} id="r3" />
              <Label htmlFor="r3">Income</Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InsertCategoryDialog;
