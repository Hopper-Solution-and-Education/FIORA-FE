import { formatCurrency } from '@/shared/utils';
import { memo } from 'react';

interface BarLabelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  renderValue?: string;
  className?: string;
  textColor?: string;
  fontSize?: string;
  showShadow?: boolean;
  minWidth?: number;
}

const BarLabel = ({
  x,
  y,
  width,
  height,
  value,
  renderValue,
  className = '',
  textColor = 'white',
  fontSize = 'text-sm',
  showShadow = true,
  minWidth = 60,
}: BarLabelProps) => {
  if (width < minWidth) return null;

  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      className={`font-medium ${fontSize} fill-${textColor} dark:fill-${textColor} ${className}`}
      style={{
        filter: showShadow ? 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))' : 'none',
        pointerEvents: 'none',
      }}
    >
      {renderValue ? renderValue : formatCurrency(value)}
    </text>
  );
};

export default memo(BarLabel);
