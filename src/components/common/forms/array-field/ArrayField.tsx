'use client';

import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import {
  ArrayPath,
  Controller,
  FieldArray,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FieldV2Props } from '../FormConfig';
import { ICON_SIZE } from '@/shared/constants/size';

export interface ArrayFieldConfig<T extends FieldValues> {
  name: ArrayPath<T>;
  emptyItem: FieldArray<T, ArrayPath<T>>;
  fields: React.ReactElement[];
  addButtonText?: string;
}

const ArrayField = <T extends FieldValues>({
  name,
  emptyItem,
  fields,
  addButtonText = 'Add Item',
}: ArrayFieldConfig<T>) => {
  const { control } = useFormContext<T>();
  const {
    fields: items,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="border p-6 rounded-xl relative bg-white shadow-sm space-y-4">
          {/* Remove button */}
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute m-1 right-3 text-destructive p-1"
          >
            <Trash2 size={ICON_SIZE.SM} />
          </button>

          {/* Render field components: mỗi field là một hàng */}
          <div className="flex flex-col">
            {fields.map((fieldElement) => {
              const element = fieldElement as React.ReactElement<FieldV2Props<T>>;
              const fieldName: string = element.props.name;
              const indexedName = `${name}.${index}.${fieldName}` as Path<T>;

              return (
                <Controller
                  key={indexedName}
                  name={indexedName}
                  control={control}
                  render={({ field, fieldState: { error } }) =>
                    React.cloneElement(element, {
                      ...field,
                      error,
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      ))}

      <Button type="button" variant="default" onClick={() => append(emptyItem)} className="w-full">
        <Plus className="h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  );
};

export default ArrayField;
