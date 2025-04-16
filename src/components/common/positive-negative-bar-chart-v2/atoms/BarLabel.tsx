import { memo } from 'react';

const BarLabel = ({ x, y, width, height, value, formatter }: any) => {
  if (Math.abs(width) < 40) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      className={`font-medium ${Math.abs(width) > 60 ? 'text-sm' : 'text-xs'} fill-white dark:fill-white`}
      style={{
        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))',
        pointerEvents: 'none',
      }}
    >
      {formatter(value)}
    </text>
  );
};

export default memo(BarLabel);
