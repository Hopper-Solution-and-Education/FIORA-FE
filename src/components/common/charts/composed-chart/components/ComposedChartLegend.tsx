import { ColumnConfig, LineConfig } from '@/shared/types/chart.type';

interface CustomLegendProps {
  columns: ColumnConfig[];
  lines?: LineConfig[];
}

export const renderCustomLegend = ({ columns, lines }: CustomLegendProps) => (
  <div className="flex justify-center items-center gap-4 mt-4">
    {columns.map((column, index) => (
      <div key={`legend-column-${index}`} className="flex items-center">
        <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: column.color }} />
        <span className="text-sm text-gray-600 dark:text-gray-400">{column.name}</span>
      </div>
    ))}
    {lines &&
      lines.map((line, index) => (
        <div key={`legend-line-${index}`} className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: line.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">{line.name}</span>
        </div>
      ))}
  </div>
);
