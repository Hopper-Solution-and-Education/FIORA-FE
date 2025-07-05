import { Icons } from '@/components/Icon';
import { Switch } from '@/components/ui/switch';
import {
  resetColumns,
  toggleColumn,
  updateColumnIndex,
} from '@/features/setting/module/wallet/slices';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useMemo } from 'react';
import { WalletSettingTableColumnKey } from '../types/setting.type';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: WalletSettingTableColumnKey;
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

const WalletSettingColumnMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const columnConfig = useAppSelector((state) => state.walletSetting.columnConfig);

  const shownColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as WalletSettingTableColumnKey[])
        .filter((key) => columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  const hiddenColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as WalletSettingTableColumnKey[])
        .filter((key) => !columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdx = shownColumns.indexOf(active.id as WalletSettingTableColumnKey);
    const overIdx = shownColumns.indexOf(over.id as WalletSettingTableColumnKey);
    if (activeIdx === -1 || overIdx === -1) return;

    const updated = [...shownColumns];
    const [removed] = updated.splice(activeIdx, 1);
    updated.splice(overIdx, 0, removed);
    const payload = updated.map((key, idx) => ({ key, newIndex: idx }));

    dispatch(updateColumnIndex(payload));
  };

  return (
    <div className="w-52">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className="font-semibold text-base text-foreground">Column Settings</span>
        <button
          className="p-1 ml-2"
          onClick={() => dispatch(resetColumns())}
          title="Reset to default"
        >
          <Icons.refreshCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={shownColumns} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 mb-3">
            {shownColumns.map((colKey: WalletSettingTableColumnKey) => (
              <SortableItem key={colKey} id={colKey}>
                <div
                  className={cn(
                    'flex items-center justify-between rounded-md px-2 py-1 border transition text-sm font-medium bg-background border-transparent hover:bg-muted',
                  )}
                >
                  <span className="cursor-grab mr-2 flex items-center" style={{ minWidth: 20 }}>
                    <Icons.gripVertical className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <span className="flex-1 truncate text-foreground">{colKey}</span>
                  <Switch
                    checked={true}
                    onCheckedChange={() => dispatch(toggleColumn(colKey))}
                    className="z-10 scale-90"
                  />
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Hidden columns */}
      <div className="mt-1">
        {hiddenColumns.length > 0 ? (
          hiddenColumns.map((colKey: WalletSettingTableColumnKey) => (
            <div
              key={colKey}
              className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted transition text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Icons.gripVertical className="w-4 h-4" />
                <span className="font-normal truncate">{colKey}</span>
              </span>
              <Switch
                checked={false}
                onCheckedChange={() => dispatch(toggleColumn(colKey))}
                className="z-10 scale-90"
              />
            </div>
          ))
        ) : (
          <div className="text-xs text-center pt-2 text-muted-foreground italic px-2">
            No hidden columns
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSettingColumnMenu;
