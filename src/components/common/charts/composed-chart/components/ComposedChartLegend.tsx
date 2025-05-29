import { ColumnConfig, LineConfig } from '@/shared/types/chart.type';

interface RenderCustomLegendProps {
  columns: ColumnConfig[];
  lines?: LineConfig[];
}

export const renderCustomLegend = ({ columns, lines }: RenderCustomLegendProps) => {
  const legendItems = [
    ...columns.map((col) => ({
      name: col.name,
      color: col.color,
    })),
    ...(lines?.map((line) => ({
      name: line.name,
      color: line.color,
    })) || []),
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
      {legendItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
        >
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: item.color }} />
          <span className="text-sm">{item.name}</span>
        </div>
      ))}
    </div>
  );
};
