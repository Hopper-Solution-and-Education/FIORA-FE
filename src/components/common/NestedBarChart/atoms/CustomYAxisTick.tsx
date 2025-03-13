const CustomYAxisTick = ({ x, y, payload, processedData, expandedItems, onToggleExpand }: any) => {
  const item = processedData.find((d: any) => d.name === payload.value);
  const isChild = item?.isChild;
  const hasChildren = !isChild && item?.children && item.children.length > 0;

  // Truncate label
  const label = isChild
    ? `↳ ${payload.value.slice(0, 15)}${payload.value.length > 15 ? '...' : ''}`
    : `${payload.value.slice(0, 17)}${payload.value.length > 17 ? '...' : ''}`;

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
        {label}
      </text>
    </g>
  );
};

export default CustomYAxisTick;
