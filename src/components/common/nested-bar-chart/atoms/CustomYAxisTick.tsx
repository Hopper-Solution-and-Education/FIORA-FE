import { useWindowSize } from '@/shared/utils/device';

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: any;
  processedData: any;
  expandedItems: any;
  onToggleExpand: (name: string) => void;
  callback: () => void;
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({
  x,
  y,
  payload,
  processedData,
  expandedItems,
  onToggleExpand,
}: any) => {
  const { width } = useWindowSize();
  const item = processedData.find((d: any) => d.name === payload.value);
  const isChild = item?.isChild;
  const hasChildren = !isChild && item?.children && item.children.length > 0;

  // Truncate label for children (mobile and desktop)
  const childLabel = isChild
    ? `↳ ${payload.value.slice(0, 15)}${payload.value.length > 15 ? '...' : ''}`
    : null;
  const parentLabel = `${payload.value.slice(0, 17)}${payload.value.length > 17 ? '...' : ''}`;

  if (width < 640) {
    // Mobile: Button for parents, text for children
    return (
      <g transform={`translate(${x},${y})`}>
        {hasChildren ? (
          <g onClick={() => onToggleExpand(payload.value)} className="cursor-pointer">
            <rect
              x="-20"
              y="-8"
              width="16"
              height="16"
              fill="transparent"
              className="hover:fill-gray-200 dark:hover:fill-gray-700"
            />
            <text
              x="-12"
              y="4"
              textAnchor="middle"
              className="text-sm fill-gray-600 dark:fill-gray-400 transition-all duration-200"
            >
              {expandedItems[payload.value] ? '−' : '+'}
            </text>
          </g>
        ) : (
          <>
            <text
              x="-16"
              y="4"
              textAnchor="end"
              className="text-sm fill-gray-600 dark:fill-gray-400"
            >
              {childLabel}
            </text>
          </>
        )}
      </g>
    );
  }

  // Desktop/Tablet: Text for all
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={isChild ? '-16' : '-8'}
        y="4"
        textAnchor="end"
        className={`text-sm fill-gray-600 dark:fill-gray-400 transition-all duration-200 ${
          hasChildren
            ? 'cursor-pointer font-semibold hover:fill-blue-500 hover:underline dark:hover:fill-blue-400'
            : ''
        }`}
        onClick={hasChildren ? () => onToggleExpand(payload.value) : undefined}
      >
        {isChild ? childLabel : parentLabel}
      </text>
    </g>
  );
};

export default CustomYAxisTick;
