import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { MouseEvent, useMemo } from 'react';
import { updateVisibleColumns } from '../slices';
import { TransactionColumn, TransactionTableColumnKey } from '../types';
import { DEFAULT_TRANSACTION_TABLE_COLUMNS } from '../utils/constants';
import { useSession } from 'next-auth/react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
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
      localStorage.setItem(
        'config' + (data?.user.id.split('-')[0] ?? ''),
        JSON.stringify(tmpVisibleColumns),
      );
    }
  };

  const toggleVisibility = (event: Event | MouseEvent, col: TransactionColumn) => {
    event.stopPropagation();
    event.preventDefault();
    const updatedColumns = { ...visibleColumns };

    if (updatedColumns[col].index > -1) {
      // Hide column: First set target column index to -1
      const targetIndex = updatedColumns[col].index;
      updatedColumns[col] = {
        ...updatedColumns[col],
        index: -visibleColumns[col].index,
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
      // Show column: Set its index to be after the last visible column
      let maxIndex = -1;
      for (const key in updatedColumns) {
        if (updatedColumns[key as TransactionColumn].index > maxIndex) {
          maxIndex = updatedColumns[key as TransactionColumn].index;
        }
      }
      updatedColumns[col] = { ...updatedColumns[col], index: maxIndex + 1 };
    }

    dispatch(updateVisibleColumns(updatedColumns));
    localStorage.setItem(
      'config' + (data?.user.id.split('-')[0] ?? ''),
      JSON.stringify(updatedColumns),
    );
  };

  const handleResetSettings = () => {
    // Reset to default settings
    const defaultColumns = { ...DEFAULT_TRANSACTION_TABLE_COLUMNS };
    dispatch(updateVisibleColumns(defaultColumns));
    localStorage.setItem(
      'config' + (data?.user.id.split('-')[0] ?? ''),
      JSON.stringify(defaultColumns),
    );
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
    <DropdownMenu>
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
          <h2 className="font-semibold">Filter & Settings</h2>
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
                      <DropdownMenuItem
                        className="w-[200px] py-1 flex justify-between items-center cursor-pointer"
                        onClick={(e) => {
                          toggleVisibility(e, key as TransactionColumn);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical size={15} className="cursor-grab text-gray-400" />
                        </div>
                        <p className="w-full font-semibold">{key}</p>
                        <Switch
                          checked={tableVisibleColumns[key as TransactionColumn].index > 0}
                          onClick={(e) => {
                            toggleVisibility(e, key as TransactionColumn);
                          }}
                          className="z-10"
                        />
                      </DropdownMenuItem>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            {Object.keys(hiddenColumns).map((key: string) => (
              <DropdownMenuItem
                key={key}
                className="w-[200px] py-1 flex justify-between items-center cursor-pointer"
                onClick={(e) => {
                  toggleVisibility(e, key as TransactionColumn);
                }}
              >
                <div className="flex items-center gap-2">
                  <GripVertical size={15} className="cursor-not-allowed text-gray-400" />
                </div>
                <p className="w-full font-normal text-gray-700">{key}</p>
                <Switch
                  checked={hiddenColumns[key as TransactionColumn].index > 0}
                  onClick={(e) => {
                    toggleVisibility(e, key as TransactionColumn);
                  }}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
