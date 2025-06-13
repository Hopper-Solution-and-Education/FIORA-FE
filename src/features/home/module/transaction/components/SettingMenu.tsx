import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { updateVisibleColumns } from '../slices';
import { TransactionColumn, TransactionTableColumnKey } from '../types';
import { DEFAULT_TRANSACTION_TABLE_COLUMNS } from '../utils/constants';
import { useSession } from 'next-auth/react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const SettingsMenu = () => {
  const { data } = useSession();
  const dispatch = useAppDispatch();
  const { visibleColumns } = useAppSelector((state) => state.transaction);
  const [isOpen, setIsOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require a more intentional drag to start
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over?.id) {
      const tmpVisibleColumns = Object.keys(visibleColumns).reduce(
        (acc, key) => {
          const typeKey = key as TransactionColumn;
          const activeId = active.id as TransactionColumn;
          const overId = over?.id as TransactionColumn;

          // Set active item's index to match over item's index
          if (typeKey === activeId) {
            acc[activeId] = {
              ...visibleColumns[activeId],
              index: visibleColumns[overId].index,
            };
          } else {
            // Create a new column object for each key
            if (visibleColumns[activeId].index < visibleColumns[overId].index) {
              acc[typeKey] = {
                ...visibleColumns[typeKey],
                index:
                  visibleColumns[typeKey].index <= visibleColumns[overId].index &&
                  visibleColumns[typeKey].index > visibleColumns[activeId].index
                    ? visibleColumns[typeKey].index - 1
                    : visibleColumns[typeKey].index,
              };
            } else {
              acc[typeKey] = {
                ...visibleColumns[typeKey],
                index:
                  visibleColumns[typeKey].index >= visibleColumns[overId].index &&
                  visibleColumns[typeKey].index < visibleColumns[activeId].index
                    ? visibleColumns[typeKey].index + 1
                    : visibleColumns[typeKey].index,
              };
            }
          }

          return acc;
        },
        {} as typeof visibleColumns,
      );

      dispatch(updateVisibleColumns(tmpVisibleColumns));
      saveToLocalStorage(tmpVisibleColumns);
    }
  };

  // Separated save to localStorage function to avoid repetition
  const saveToLocalStorage = (columns: typeof visibleColumns) => {
    localStorage.setItem('config' + (data?.user.id.split('-')[0] ?? ''), JSON.stringify(columns));
  };

  // Handle column visibility toggling - separate from the dropdown menu item click
  const toggleVisibility = (col: TransactionColumn) => {
    const updatedColumns = { ...visibleColumns };
    const isCurrentlyVisible = updatedColumns[col].index >= 0;

    if (isCurrentlyVisible) {
      // Hide column: Set index to negative
      const targetIndex = updatedColumns[col].index;
      updatedColumns[col] = {
        ...updatedColumns[col],
        index: -1, // Simplified to just -1
        sortedBy: 'none',
      };

      // Adjust other columns' indexes if they were after the hidden column
      for (const key in updatedColumns) {
        if (key !== col && updatedColumns[key as TransactionColumn].index > targetIndex) {
          updatedColumns[key as TransactionColumn] = {
            ...updatedColumns[key as TransactionColumn],
            index: updatedColumns[key as TransactionColumn].index - 1,
          };
        }
      }
    } else {
      // Show column: Check if all other columns are hidden
      const allHidden = Object.keys(updatedColumns).every(
        (key) => key === col || updatedColumns[key as TransactionColumn].index < 0,
      );

      if (allHidden) {
        // If all columns are hidden, set this column's index to 0
        updatedColumns[col] = { ...updatedColumns[col], index: 0 };
      } else {
        // Otherwise, find the last visible column's index and place after it
        let maxIndex = -1;
        for (const key in updatedColumns) {
          if (updatedColumns[key as TransactionColumn].index > maxIndex) {
            maxIndex = updatedColumns[key as TransactionColumn].index;
          }
        }
        updatedColumns[col] = { ...updatedColumns[col], index: maxIndex + 1 };
      }

      // Ensure indices are sequential
      const visibleKeys = Object.keys(updatedColumns).filter(
        (key) => updatedColumns[key as TransactionColumn].index >= 0,
      );
      visibleKeys.sort(
        (a, b) =>
          updatedColumns[a as TransactionColumn].index -
          updatedColumns[b as TransactionColumn].index,
      );

      visibleKeys.forEach((key, idx) => {
        updatedColumns[key as TransactionColumn] = {
          ...updatedColumns[key as TransactionColumn],
          index: idx,
        };
      });
    }

    dispatch(updateVisibleColumns(updatedColumns));
    saveToLocalStorage(updatedColumns);
  };

  const handleResetSettings = () => {
    // Reset to default settings
    const defaultColumns = { ...DEFAULT_TRANSACTION_TABLE_COLUMNS };
    dispatch(updateVisibleColumns(defaultColumns));
    saveToLocalStorage(defaultColumns);
  };

  // Memoize the columns to avoid unnecessary re-renders and sort
  const tableVisibleColumns: TransactionTableColumnKey = useMemo((): TransactionTableColumnKey => {
    const columns =
      Object.keys(visibleColumns).length > 0
        ? Object.keys(visibleColumns)?.reduce((acc, key) => {
            if (visibleColumns[key as TransactionColumn].index > -1) {
              acc[key as TransactionColumn] = visibleColumns[key as TransactionColumn];
            }
            return acc;
          }, {} as TransactionTableColumnKey)
        : DEFAULT_TRANSACTION_TABLE_COLUMNS;

    // Sort columns by index, ensuring negative indices are placed last
    return Object.fromEntries(
      Object.entries(columns)
        .sort((a, b) => {
          // If both indices are negative or both are positive, sort normally
          if ((a[1].index < 0 && b[1].index < 0) || (a[1].index >= 0 && b[1].index >= 0)) {
            return a[1].index - b[1].index;
          }
          // If only a's index is negative, place it after b
          if (a[1].index < 0) return 1;
          // If only b's index is negative, place it after a
          return -1;
        })
        .map(([key, value]) => [key, value]),
    ) as TransactionTableColumnKey;
  }, [visibleColumns]);

  const hiddenColumns = useMemo((): TransactionTableColumnKey => {
    const columns = Object.keys(visibleColumns).reduce((acc, key) => {
      if (visibleColumns[key as TransactionColumn].index < 0) {
        acc[key as TransactionColumn] = visibleColumns[key as TransactionColumn];
      }
      return acc;
    }, {} as TransactionTableColumnKey);

    return columns;
  }, [visibleColumns]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 py-2 bg-gray-500">
                <SlidersHorizontal />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-fit min-w-200 rounded-lg p-4"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal flex justify-between items-center">
          <h2 className="font-semibold">Column Settings</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'ghost'} className="px-2" onClick={handleResetSettings}>
                  <RefreshCcw size={15} color="green" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Filter contents */}
        <div className="w-full h-fit flex justify-start items-start gap-2 pt-2">
          {/* Show/hide columns */}
          <DropdownMenuGroup className="w-fit">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={Object.keys(tableVisibleColumns)}
                strategy={verticalListSortingStrategy}
              >
                <div className="w-full h-full flex flex-col justify-start items-center">
                  {Object.keys(tableVisibleColumns).map((key: string) => (
                    <SortableItem key={key} id={key}>
                      <div className="w-[200px] py-1 flex justify-between items-center px-2 rounded-md hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <GripVertical size={15} className="cursor-grab text-gray-400" />
                          <p className="w-full font-semibold">{key}</p>
                        </div>
                        <Switch
                          checked={tableVisibleColumns[key as TransactionColumn].index >= 0}
                          onCheckedChange={() => toggleVisibility(key as TransactionColumn)}
                          className="z-10"
                        />
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {Object.keys(hiddenColumns).length > 0 ? (
              Object.keys(hiddenColumns).map((key: string) => (
                <div
                  key={key}
                  className="w-[200px] py-1 flex justify-between items-center px-2 rounded-md hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={15} className="cursor-not-allowed text-gray-300" />
                    <p className="w-full font-normal text-gray-700">{key}</p>
                  </div>
                  <Switch
                    checked={false}
                    onCheckedChange={() => toggleVisibility(key as TransactionColumn)}
                  />
                </div>
              ))
            ) : (
              <div className="text-xs text-center pt-2 text-gray-400 italic px-2">
                No hidden columns
              </div>
            )}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
