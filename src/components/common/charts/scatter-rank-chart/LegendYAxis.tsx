import { LegendProps } from './types';

const LegendYAxis = ({ items, className = '' }: LegendProps) => (
  <div className={`flex flex-col gap-4 items-center justify-center mt-2 ${className}`}>
    {items.map((item) => (
      <div key={item.name} className="flex flex-col items-center justify-center gap-2">
        <span
          className="text-xs font-bold"
          style={{
            writingMode: 'vertical-lr',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
          }}
        >
          {item.name}
        </span>
        {item.color && (
          <span
            className="inline-block w-4 h-4 rounded mb-1"
            style={{ background: item.color || '#ccc' }}
          />
        )}
      </div>
    ))}
  </div>
);

export default LegendYAxis;
