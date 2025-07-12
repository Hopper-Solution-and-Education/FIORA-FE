import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import type { FaqsCategoriesResponse } from '../../domain/entities/models/faqs';

interface CategorySelectProps {
  label: string;
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  categories: FaqsCategoriesResponse[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  label,
  id,
  value,
  onChange,
  categories,
  placeholder = 'Select category',
  required = false,
  error,
  disabled = false,
  loading = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
        <SelectTrigger
          className={`
            ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        >
          <SelectValue placeholder={loading ? 'Loading categories...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {categories.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">
              {loading ? 'Loading...' : 'No categories found'}
            </div>
          )}
        </SelectContent>
      </Select>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default CategorySelect;
