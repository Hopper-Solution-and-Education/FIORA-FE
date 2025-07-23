import { Icons } from '@/components/Icon';
import { Switch } from '@/components/ui/switch';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { resetColumns, toggleColumn, updateColumnIndex } from '../../slices';
import { saveColumnConfigToStorage } from '../../slices/persist';
import SortableColumnMenuItem from '../atoms/SortableColumnMenuItem';
import { NotificationDashboardTableColumnKey } from '../types/setting.type';

const NotificationDashboardColumnMenu = () => {
  const dispatch = useAppDispatch();
  const columnConfig = useAppSelector((state) => state.notificationDashboard.columnConfig);

  // Compute visible columns (isVisible = true), sorted by index
  const shownColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as NotificationDashboardTableColumnKey[])
        .filter((key) => columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  // Compute hidden columns (isVisible = false), sorted by index
  const hiddenColumns = useMemo(
    () =>
      (Object.keys(columnConfig) as NotificationDashboardTableColumnKey[])
        .filter((key) => !columnConfig[key].isVisible)
        .sort((a, b) => columnConfig[a].index - columnConfig[b].index),
    [columnConfig],
  );

  // Initialize sensors for drag & drop (mouse and keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Toggle column visibility and persist new config to localStorage
  const handleToggleColumn = (colKey: NotificationDashboardTableColumnKey) => {
    dispatch(toggleColumn(colKey));
    setTimeout(() => {
      saveColumnConfigToStorage({
        ...columnConfig,
        [colKey]: { ...columnConfig[colKey], isVisible: !columnConfig[colKey].isVisible },
      });
    }, 0);
  };

  // Reset to default config and persist to localStorage
  const handleResetColumns = () => {
    dispatch(resetColumns());
    setTimeout(() => {
      saveColumnConfigToStorage(JSON.parse(JSON.stringify(columnConfig)));
    }, 0);
  };

  // Handle drag & drop to reorder columns, then persist new order to localStorage
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    const activeIdx = shownColumns.indexOf(active.id as NotificationDashboardTableColumnKey);
    const overIdx = shownColumns.indexOf(over.id as NotificationDashboardTableColumnKey);

    if (activeIdx === -1 || overIdx === -1) return;
    const updated = [...shownColumns];
    const [removed] = updated.splice(activeIdx, 1);
    updated.splice(overIdx, 0, removed);

    const payload = updated.map((key, idx) => ({ key, newIndex: idx }));

    dispatch(updateColumnIndex(payload));

    setTimeout(() => {
      const newConfig = { ...columnConfig };
      payload.forEach(({ key, newIndex }) => {
        newConfig[key] = { ...newConfig[key], index: newIndex };
      });
      saveColumnConfigToStorage(newConfig);
    }, 0);
  };

  // Render the column menu UI
  return (
    <div className="w-52">
      {/* Menu header with reset button */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className="font-semibold text-base text-foreground">Column Settings</span>
        <button className="p-1 ml-2" onClick={handleResetColumns} title="Reset to default">
          <Icons.refreshCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
        </button>
      </div>

      {/* List of visible columns, sortable by drag & drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={shownColumns} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 mb-3">
            {shownColumns.map((colKey) => (
              <SortableColumnMenuItem key={colKey} id={colKey}>
                <div className="flex items-center justify-between rounded-md px-2 py-1 border transition text-sm font-medium bg-background border-transparent hover:bg-muted">
                  <span className="cursor-grab mr-2 flex items-center" style={{ minWidth: 20 }}>
                    <Icons.gripVertical className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <span className="flex-1 truncate text-foreground">{colKey}</span>
                  <Switch
                    checked={true}
                    onCheckedChange={() => handleToggleColumn(colKey)}
                    className="z-10 scale-90"
                  />
                </div>
              </SortableColumnMenuItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* List of hidden columns, can be toggled back on */}
      <div className="mt-1">
        {hiddenColumns.length > 0 ? (
          hiddenColumns.map((colKey) => (
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
                onCheckedChange={() => handleToggleColumn(colKey)}
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

export default NotificationDashboardColumnMenu;
