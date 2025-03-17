'use client';

import type React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProductType } from '@prisma/client';
import debounce from 'lodash/debounce';
import { fetchCategories } from '../../slices';
import IconUploader from '../atoms/IconUploader';
import { type ProductFormValues, productSchema } from '../schema/addProduct.schema';

const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const {
    data: categories,
    isLoading,
    hasMore,
    page,
    limit,
  } = useAppSelector((state) => state.productManagement.categories);
  const form = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      icon: '',
      name: '',
      description: '',
      price: undefined,
      taxRate: undefined,
      type: undefined,
      category_id: '',
      items: [],
    },
  });

  const loadMoreCategories = () => {
    if (hasMore && !isLoading) {
      dispatch(fetchCategories({ page: page + 1, pageSize: limit }));
    }
  };

  useEffect(() => {
    dispatch(fetchCategories({ page: page, pageSize: limit }));
  }, []);

  const debouncedLoadMore = useRef(debounce(loadMoreCategories, 200));

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPosition = target.scrollHeight - target.scrollTop - target.clientHeight;

    console.log('Scroll position:', scrollPosition, 'hasMore:', hasMore, 'isLoading:', isLoading);

    if (scrollPosition < 20 && hasMore && !isLoading) {
      console.log('Loading more categories, current page:', page);
      debouncedLoadMore.current();
    }
  };

  useEffect(() => {
    if (!hasMore && categories.length > 0 && !isLoading) {
      console.log('All categories loaded, total:', categories.length);
    }
  }, [hasMore, categories.length, isLoading]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Convert price and taxRate to proper decimal format
      const formattedData = {
        ...data,
        price: Number(data.price),
        taxRate: data.taxRate ? Number(data.taxRate) : null,
      };
      console.log(JSON.stringify(formattedData));
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add New
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[70%]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new product or service.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={ProductType.Product}>Product</SelectItem>
                          <SelectItem value={ProductType.Service}>Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormDescription>Maximum 50 characters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          className="max-h-[200px]"
                          onScroll={handleScroll}
                          position="popper"
                          sideOffset={4}
                        >
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                          {isLoading && (
                            <div className="flex items-center justify-center py-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onKeyDown={(e) => {
                            if (
                              isNaN(Number(e.key)) &&
                              e.key !== 'Backspace' &&
                              e.key !== 'Delete' &&
                              e.key !== '.' &&
                              e.key !== 'ArrowLeft' &&
                              e.key !== 'ArrowRight'
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            // Check if the input is a valid number after change, if not, reset to empty
                            if (isNaN(Number(e.target.value)) && e.target.value !== '') {
                              e.target.value = '';
                              field.onChange(undefined);
                            } else {
                              field.onChange(Number(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tax Rate */}
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onKeyDown={(e) => {
                            if (
                              isNaN(Number(e.key)) &&
                              e.key !== 'Backspace' &&
                              e.key !== 'Delete' &&
                              e.key !== '.' &&
                              e.key !== 'ArrowLeft' &&
                              e.key !== 'ArrowRight'
                            ) {
                              e.preventDefault();
                            }
                          }}
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => {
                            if (isNaN(Number(e.target.value)) && e.target.value !== '') {
                              e.target.value = '';
                              field.onChange(undefined);
                            } else {
                              field.onChange(Number(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>Optional tax rate percentage</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Maximum 1000 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon */}
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <IconUploader fieldPath="icon" label="Product Icon" maxSize={2 * 1024 * 1024} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Product</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
