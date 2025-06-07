import { LegendProps } from './types';

const LegendXAxis = ({ items, className = '' }: LegendProps) => {
  return (
    <div className={`flex flex-row gap-4 items-center justify-center mt-2 ${className}`}>
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded" style={{ background: item.color }} />
          <span className="text-xs font-bold">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LegendXAxis;
