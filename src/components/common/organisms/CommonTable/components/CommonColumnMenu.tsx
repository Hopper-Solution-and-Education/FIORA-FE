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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { ColumnConfigMap, CommonTableColumn } from '../types';

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
  } as React.CSSProperties;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default function CommonColumnMenu<T>({
  columns,
  config,
  onChange,
  onReset,
}: {
  columns: CommonTableColumn<T>[];
  config: ColumnConfigMap;
  onChange: (cfg: ColumnConfigMap) => void;
  onReset?: () => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const shown = useMemo(
    () =>
      columns
        .map((c) => c.key)
        .filter((key) => config[key]?.isVisible)
        .sort((a, b) => (config[a].index ?? 0) - (config[b].index ?? 0)),
    [columns, config],
  );

  const hidden = useMemo(
    () =>
      columns
        .map((c) => c.key)
        .filter((key) => !config[key]?.isVisible)
        .sort((a, b) => (config[a].index ?? 0) - (config[b].index ?? 0)),
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
    onChange(next);
  };

  const toggle = (key: string) => {
    const next: ColumnConfigMap = {
      ...config,
      [key]: { ...config[key], isVisible: !config[key].isVisible },
    };
    onChange(next);
  };

  return (
    <div className="w-56">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className="font-semibold text-base text-foreground">Column Settings</span>
        <button className="p-1 ml-2" onClick={onReset} title="Reset to default">
          <Icons.refreshCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={shown} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-1 mb-3">
            {shown.map((key) => (
              <SortableItem key={key} id={key}>
                <div
                  className={cn(
                    'flex items-center justify-between rounded-md px-2 py-1 border transition text-sm font-medium bg-background border-transparent hover:bg-muted',
                  )}
                >
                  <span className="cursor-grab mr-2 flex items-center" style={{ minWidth: 20 }}>
                    <Icons.gripVertical className="w-4 h-4 text-muted-foreground" />
                  </span>
                  <span className="flex-1 truncate text-foreground">{key}</span>
                  <Switch checked onCheckedChange={() => toggle(key)} className="z-10 scale-90" />
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-1">
        {hidden.length > 0 ? (
          hidden.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-muted transition text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Icons.gripVertical className="w-4 h-4" />
                <span className="font-normal truncate">{key}</span>
              </span>
              <Switch
                checked={false}
                onCheckedChange={() => toggle(key)}
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
}
