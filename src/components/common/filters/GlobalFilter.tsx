'use client';

import { Check, Funnel, FunnelPlus, FunnelX } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  FilterColumn,
  FilterComponentConfig,
  FilterCriteria,
  FilterFieldMapping,
} from '../../../shared/types/filter.types';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

export const DEFAULT_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

// Define additional types for filter values
export type FilterValue = string | number | boolean | string[] | number[] | RangeValue;

export interface RangeValue {
  from?: number;
  to?: number;
  min?: number;
  max?: number;
}

// Enhanced props type for more flexibility
export interface GlobalFilterProps {
  filterParams: any;
  filterComponents: FilterComponentConfig[];
  onFilterChange: (newFilter: FilterCriteria) => void;
  fieldMappings?: FilterFieldMapping<any>[];
  defaultFilterCriteria?: FilterCriteria;
  structureCreator?: (params: any) => Record<string, unknown>;
  currentFilter: any;
  showFilterHeader?: boolean;
}

const GlobalFilter = (props: GlobalFilterProps) => {
  const {
    filterParams,
    filterComponents,
    onFilterChange,
    fieldMappings = [],
    defaultFilterCriteria = DEFAULT_FILTER_CRITERIA,
    structureCreator,
    currentFilter,
    showFilterHeader = true,
  } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleResetFilter = () => {
    onFilterChange(defaultFilterCriteria);
    handleClose();
  };

  // Creates the filter structure from the UI state based on field mappings or custom creator
  const createFilterStructure = (params: any): Record<string, unknown> => {
    // If custom structure creator is provided, use it
    if (structureCreator) {
      return structureCreator(params);
    }

    const updatedFilters: Record<string, unknown> = {};
    const andConditions: Record<string, unknown>[] = [];
    const orConditions: Record<string, unknown>[] = [];

    // Process each field according to its mapping
    fieldMappings.forEach((mapping) => {
      const value = params[mapping.key];

      // Skip if value should be excluded based on condition
      if (mapping.condition && !mapping.condition(value)) {
        return;
      }

      if (!mapping.mapping) {
        // Simple direct mapping
        if (Array.isArray(value) && value.length > 0) {
          const condition = {
            OR: value.map((item) => ({ [mapping.key as string]: item })),
          };

          if (mapping.comparator === 'AND') {
            andConditions.push(condition);
          } else {
            orConditions.push(condition);
          }
        } else if (value !== undefined && value !== null) {
          // Direct non-array value
          updatedFilters[mapping.key as string] = value;
        }
      } else {
        // Complex mapping with field transformation
        const { field, nestedField, transform } = mapping.mapping;

        if (Array.isArray(value) && value.length > 0) {
          // Array values with complex mapping
          const mappedValues = value.map((item) => {
            const transformedValue = transform ? transform(item) : item;

            if (nestedField) {
              return { [field]: { [nestedField]: transformedValue } };
            }

            return { [field]: transformedValue };
          });

          const condition = { OR: mappedValues };

          if (mapping.comparator === 'AND') {
            andConditions.push(condition);
          } else {
            orConditions.push(condition);
          }
        } else if (value !== undefined && value !== null) {
          // Handle range values (like date ranges or numeric ranges)
          if (typeof value === 'object' && !Array.isArray(value)) {
            const rangeValue: Record<string, unknown> = {};
            const typedValue = value as RangeValue;

            if ('from' in typedValue || 'min' in typedValue) {
              const minVal = transform
                ? transform(typedValue.from || typedValue.min)
                : typedValue.from || typedValue.min;
              rangeValue.gte = minVal;
            }

            if ('to' in typedValue || 'max' in typedValue) {
              const maxVal = transform
                ? transform(typedValue.to || typedValue.max)
                : typedValue.to || typedValue.max;
              rangeValue.lte = maxVal;
            }

            if (Object.keys(rangeValue).length > 0) {
              updatedFilters[field] = rangeValue;
            }
          } else {
            // Single values with complex mapping
            const transformedValue = transform ? transform(value) : value;

            if (nestedField) {
              updatedFilters[field] = { [nestedField]: transformedValue };
            } else {
              updatedFilters[field] = transformedValue;
            }
          }
        }
      }
    });

    // Add AND conditions if there are any
    if (andConditions.length > 0) {
      updatedFilters.AND = andConditions;
    }

    // Add OR conditions if there are any
    if (orConditions.length > 0) {
      updatedFilters.OR = orConditions;
    }

    return updatedFilters;
  };

  const handleSaveFilterChanges = () => {
    const updatedFilters = createFilterStructure(filterParams);

    onFilterChange({
      ...defaultFilterCriteria,
      filters: updatedFilters,
    });

    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Split filterComponents into left and right columns
  const { leftColumnFilters, rightColumnFilters } = useMemo(() => {
    const leftFilters = filterComponents
      .filter((config) => config.column === FilterColumn.LEFT)
      .sort((a, b) => a.order - b.order);

    const rightFilters = filterComponents
      .filter((config) => config.column === FilterColumn.RIGHT)
      .sort((a, b) => a.order - b.order);

    return {
      leftColumnFilters: leftFilters,
      rightColumnFilters: rightFilters,
    };
  }, [filterComponents]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => (open ? setIsOpen(open) : handleClose())}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={Object.keys(currentFilter).length === 0 ? 'secondary' : 'default'}
                className="px-3 py-2"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {Object.keys(currentFilter).length === 0 ? (
                  <FunnelPlus size={15} />
                ) : (
                  <Funnel size={15} />
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filters</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-fit min-w-200 rounded-lg p-4"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        {showFilterHeader && (
          <>
            <DropdownMenuLabel className="p-0 font-normal">
              <h2 className="font-semibold">Filter & Settings</h2>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {/* Filter contents */}
        <div className="w-full h-fit max-h-[45vh] flex justify-start items-start p-2 pb-5">
          {/* Left column filters */}
          <DropdownMenuGroup className="w-[260px]">
            <div className="w-full h-full flex flex-col justify-start items-start gap-3">
              {leftColumnFilters.map((config) => (
                <div key={config.key} className="w-full">
                  {config.component}
                </div>
              ))}
            </div>
          </DropdownMenuGroup>

          {/* Separator */}
          {rightColumnFilters.length > 0 && <div className="w-[2px] h-full bg-gray-300 mx-2"></div>}

          {/* Right column filters */}
          {rightColumnFilters.length > 0 && (
            <DropdownMenuGroup className="w-[260px]">
              <div className="w-full h-full flex flex-col justify-start items-start gap-[.8rem]">
                {rightColumnFilters.map((config) => (
                  <div key={config.key} className="w-full">
                    {config.component}
                  </div>
                ))}
              </div>
            </DropdownMenuGroup>
          )}
        </div>

        <DropdownMenuSeparator />
        <div className="w-full flex justify-end items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'destructive'} className="px-3 py-2" onClick={handleResetFilter}>
                  <FunnelX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-3 py-2" onClick={handleSaveFilterChanges}>
                  <Check className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Apply filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalFilter;
