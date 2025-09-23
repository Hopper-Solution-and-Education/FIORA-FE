import { Icons } from '@/components/Icon';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/shared/utils';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMemo } from 'react';
import { ColumnConfigMap, CommonTableColumn } from '../types';
import SortableItem from './SortableItem';

interface CommonColumnMenuProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: CommonTableColumn<T>[];
  config: ColumnConfigMap;
  onColumnChange: (cfg: ColumnConfigMap) => void;
  onColumnReset?: () => void;
}

export default function CommonColumnMenu<T>({
  columns,
  config,
  onColumnChange,
  onColumnReset,
  ...props
}: CommonColumnMenuProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const shown = useMemo(
    () =>
      columns
        .map((c) => c.key)
        .filter((key) => config[key]?.isVisible)
        .sort((a, b) => (config[a]?.index ?? 0) - (config[b]?.index ?? 0)),
    [columns, config],
  );

  const hidden = useMemo(
    () =>
      columns
        .map((c) => c.key)
        .filter((key) => !config[key]?.isVisible)
        .sort((a, b) => (config[a]?.index ?? 0) - (config[b]?.index ?? 0)),
    [columns, config],
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIdx = shown.indexOf(active.id as string);
    const overIdx = shown.indexOf(over.id as string);
    if (activeIdx === -1 || overIdx === -1) return;

    const updated = [...shown];
    const [removed] = updated.splice(activeIdx, 1);
    updated.splice(overIdx, 0, removed);

    const next: ColumnConfigMap = { ...config };
    updated.forEach((k, idx) => {
      next[k] = { ...next[k], index: idx };
    });
    onColumnChange(next);
  };

  const toggle = (key: string) => {
    const current = config[key] ?? {
      isVisible: false,
      index: shown.length,
      alignOverride: undefined,
    };
    const next: ColumnConfigMap = {
      ...config,
      [key]: { ...current, isVisible: !current.isVisible },
    };
    onColumnChange(next);
  };

  return (
    <div className="w-56" {...props}>
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className="font-semibold text-base text-foreground">Column Settings</span>

        <button className="p-1 ml-2" onClick={onColumnReset} title="Reset to default">
          <Icons.refreshCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={shown} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 mb-3">
            {shown.map((key) => {
              const column = columns.find((c) => c.key === key);
              const title = column?.title || key;

              return (
                <SortableItem key={key} id={key}>
                  <div
                    className={cn(
                      'flex items-center justify-between rounded-md px-2 py-1 border transition text-sm font-medium bg-background border-transparent hover:bg-muted',
                    )}
                  >
                    <span className="cursor-grab mr-2 flex items-center" style={{ minWidth: 20 }}>
                      <Icons.gripVertical className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1 truncate text-foreground">{title}</span>
                    <Switch checked onCheckedChange={() => toggle(key)} className="z-10 scale-90" />
                  </div>
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-1">
        {hidden.length > 0 ? (
          hidden.map((key) => {
            const column = columns.find((c) => c.key === key);
            const title = column?.title || key;

            return (
              <div
                key={key}
                className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted transition text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Icons.gripVertical className="w-4 h-4" />
                  <span className="font-normal truncate">{title}</span>
                </span>

                <Switch
                  checked={false}
                  onCheckedChange={() => toggle(key)}
                  className="z-10 scale-90"
                />
              </div>
            );
          })
        ) : (
          <div className="text-xs text-center pt-2 text-muted-foreground italic px-2">
            No hidden columns
          </div>
        )}
      </div>
    </div>
  );
}
