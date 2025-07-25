import SelectField from '@/components/common/forms/select/SelectField';
import { Category } from '@/features/home/module/category/slices/types';
import React from 'react';

interface CategorySelectProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  categories: Category[];
  [key: string]: any;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  side,
  name,
  value = '',
  onChange = () => {},
  categories,
  ...props
}) => {
  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
    icon: category.icon,
  }));

  return (
    <SelectField
      side={side}
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select a category"
      {...props}
    />
  );
};

export default CategorySelect;
