import React from 'react';
import { Category } from '@/features/home/module/category/slices/types';
import SelectField from '@/components/common/atoms/SelectField';

interface CategorySelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  categories: Category[];
  [key: string]: any;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
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
