import React, { memo } from 'react';

const ChartLegend = ({ items }: { items: { name: string; color: string }[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default memo(ChartLegend);
