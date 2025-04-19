'use client';

import { Button } from '@/components/ui/button';
import { ICON_SIZE } from '@/shared/constants/size';
import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  ArrayPath,
  Controller,
  FieldArray,
  FieldValues,
  Path,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { GlobalLabel } from '../../atoms';
import { GlobalDialog } from '../../organisms';
import { FieldV2Props } from '../FormConfig';

export interface ArrayFieldConfig<T extends FieldValues> {
  label?: string;
  name: ArrayPath<T>;
  emptyItem: FieldArray<T, ArrayPath<T>>;
  fields: React.ReactElement[];
  addButtonText?: string;
  getItemTitle?: (index: number, total: number) => string;
  className?: string;
  required?: boolean;
  id?: string;
}

const ArrayField = <T extends FieldValues>({
  id,
  required,
  label,
  name,
  emptyItem,
  fields,
  addButtonText = 'Add Item',
  getItemTitle,
}: ArrayFieldConfig<T>) => {
  const { control } = useFormContext<T>();
  const { fields: items, append, remove } = useFieldArray({ control, name });
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        {' '}
        {/* Giảm margin bottom */}
        {label &&
          (typeof label === 'string' ? (
            <GlobalLabel text={label} htmlFor={id} required={required} />
          ) : (
            label
          ))}
      </div>

      {/* Item Blocks */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const itemTitle =
            typeof getItemTitle === 'function'
              ? getItemTitle(index, items.length)
              : `Item ${index + 1}`;

          return (
            <div
              key={item.id}
              className="border p-4 rounded-xl relative bg-white dark:bg-zinc-900 shadow-sm space-y-4 transition hover:shadow-md"
            >
              {/* Delete Button */}
              <Button
                variant="ghost"
                type="button"
                onClick={() => setDeleteIndex(index)}
                className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 rounded-full transition"
              >
                <Trash2 size={ICON_SIZE.SM} />
              </Button>

              {/* Title */}
              <div className="text-base font-semibold text-primary">{itemTitle}</div>

              {/* Fields */}
              <div className="flex flex-col space-y-4">
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
          );
        })}
      </div>

      {/* Add Button */}
      <Button
        type="button"
        variant="default"
        onClick={() => append(emptyItem)}
        className="w-full mt-2"
      >
        <Plus className="h-4 w-4" />
        {addButtonText}
      </Button>

      {/* Confirm Delete Dialog */}
      <GlobalDialog
        open={deleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteIndex(null);
        }}
        title="Confirm Delete"
        variant="danger"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={() => {
          if (deleteIndex !== null) remove(deleteIndex);
          setDeleteIndex(null);
        }}
        onCancel={() => setDeleteIndex(null)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ArrayField;
