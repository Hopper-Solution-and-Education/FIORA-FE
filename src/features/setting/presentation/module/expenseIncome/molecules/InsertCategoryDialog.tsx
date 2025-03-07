import { Icons } from '@/components/Icon'; // Import Icons and Icon type
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Assuming you have a Select component
import React, { useState } from 'react';
import { Category, CategoryTypeEnum } from '../../../settingSlices/expenseIncomeSlides/types';

interface InsertCategoryDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  handleCreateCategory: (category: Partial<Category>) => void;
}

interface NewCategory {
  name: string;
  type: CategoryTypeEnum;
  icon?: string; // Icon key from Icons object
}

const InsertCategoryDialog: React.FC<InsertCategoryDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  handleCreateCategory,
}) => {
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: '',
    type: CategoryTypeEnum.EXPENSE,
    icon: 'trash', // Default icon set to 'trash'
  });

  // Available icons for selection (customize as needed)
  const iconOptions = [
    { value: 'trash', label: 'Trash', icon: Icons.trash },
    { value: 'home', label: 'Home', icon: Icons.home },
    { value: 'car', label: 'Car', icon: Icons.car },
    { value: 'shoppingCart', label: 'Shopping Cart', icon: Icons.shoppingCart },
    { value: 'piggyBank', label: 'Piggy Bank', icon: Icons.piggyBank },
    { value: 'dollarSign', label: 'Dollar Sign', icon: Icons.dollarSign },
    { value: 'banknote', label: 'Banknote', icon: Icons.banknote },
    { value: 'utensils', label: 'Utensils', icon: Icons.utensils },
  ];

  const handleCreate = () => {
    handleCreateCategory(newCategory);
    setDialogOpen(false);
    setNewCategory({ name: '', type: CategoryTypeEnum.EXPENSE, icon: 'trash' });
  };

  // Get the current icon component based on the selected icon key
  const CurrentIcon = newCategory.icon ? Icons[newCategory.icon as keyof typeof Icons] : null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Name Input */}
          <Input
            placeholder="Category Name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />

          {/* Icon Selector */}
          <div>
            <Label>Category Icon</Label>
            <Select
              value={newCategory.icon}
              onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {CurrentIcon && (
                      <>
                        <CurrentIcon className="w-4 h-4" />
                        <span>
                          {iconOptions.find((opt) => opt.value === newCategory.icon)?.label}
                        </span>
                      </>
                    )}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Type Radio Group */}
          <RadioGroup
            defaultValue={CategoryTypeEnum.EXPENSE}
            className="flex gap-2"
            onValueChange={(e) => setNewCategory({ ...newCategory, type: e as CategoryTypeEnum })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={CategoryTypeEnum.EXPENSE} id="r2" />
              <Label htmlFor="r2">Expense</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={CategoryTypeEnum.INCOME} id="r3" />
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
