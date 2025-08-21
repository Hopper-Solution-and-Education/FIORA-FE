import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ItemRankChart from './ItemRankChart';
import ScatterRankingChartSkeleton from './ScatterRankingChartSkeleton';
import { defaultBarColors, ScatterChartProps } from './types';
import { getBalanceRank, getSpentRank } from './utils';

const ScatterRankingChart = ({
  currentTier,
  balanceTiers,
  spentTiers,
  title = 'Rank Progress Chart',
  className = '',
  barColors = {},
  // xLegend,
  // yLegend,
  cellRenderer,
  combinedTierIcons,
  customTooltipContent,
  isLoading = false,
  currentId,
  isDisabled = false,
  onClickXAxisRange,
  onClickYAxisRange,
}: ScatterChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });
  const [isChartReady, setIsChartReady] = useState(false);

  // const isMobile = useIsMobile();

  const balance = currentTier?.balance ?? 0;
  const spent = currentTier?.spent ?? 0;

  const colors = { ...defaultBarColors, ...barColors };

  // Check if we have data to display
  const hasData = balanceTiers.length > 0 && spentTiers.length > 0;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setChartDimensions({
          width: width - 80,
          height: height - 80,
        });
      }
    });

    observer.observe(chartContainerRef.current);

    return () => observer.disconnect();
  }, []);

  // Add loading effect
  useEffect(() => {
    if (!isLoading && hasData) {
      const timer = setTimeout(() => {
        setIsChartReady(true);
      }, 300); // Small delay for smooth transition
      return () => clearTimeout(timer);
    } else {
      setIsChartReady(false);
    }
  }, [isLoading, hasData]);

  const userBalanceRank = getBalanceRank(balance, balanceTiers);
  const userSpentRank = getSpentRank(spent, spentTiers);

  // Hover tooltips for axis progress bars
  const [hoverX, setHoverX] = useState<{ visible: boolean; left: number; value: number }>({
    visible: false,
    left: 0,
    value: 0,
  });
  const [hoverY, setHoverY] = useState<{ visible: boolean; bottom: number; value: number }>({
    visible: false,
    bottom: 0,
    value: 0,
  });
  const [hoveredXIndex, setHoveredXIndex] = useState<number | null>(null);
  const [hoveredYIndex, setHoveredYIndex] = useState<number | null>(null);

  // Helper: Calculate pixel position of currentValue on X-axis (Spent)
  const getXAxisPosition = (value: number) => {
    if (!chartDimensions.width || spentTiers.length === 0) return 0;
    const totalWidth = chartDimensions.width;
    const tierCount = spentTiers.length;

    // Handle edge cases
    if (value === 0) return 0;

    for (let i = 0; i < tierCount; i++) {
      const tier = spentTiers[i];
      const tierStart = tier.min;
      const tierEnd = tier.max === Infinity ? Number.MAX_VALUE : tier.max;

      if (value >= tierStart && value < tierEnd) {
        // Calculate the position within the current tier
        const tierWidth = totalWidth / tierCount;
        const tierMin = tierStart;
        const tierMax = tierEnd;
        const percent = (value - tierMin) / (tierMax - tierMin || 1);

        if (i === 1) {
          return i * tierWidth + percent * tierWidth + 5;
        }

        switch (tierCount) {
          case 4:
            if (i > 1) {
              return i * tierWidth + percent * tierWidth - (tierCount * 2 + i) * i;
            }
            return i * tierWidth + percent * tierWidth - tierCount;
          case 5:
            if (i === 1) {
              return i * tierWidth + percent * tierWidth;
            }
            if (i === 3) {
              return i * tierWidth + percent * tierWidth - 2;
            }
            if (i > 2) {
              return i * tierWidth + percent * tierWidth - (i + 1);
            }
            return i * tierWidth + percent * tierWidth + i;
          default:
            return i * tierWidth + percent * tierWidth;
        }
      }
    }
    // If value exceeds the last tier, return the end position
    return totalWidth;
  };

  // Helper: Calculate pixel position of currentValue on Y-axis (Balance)
  const getYAxisPosition = (value: number) => {
    let pos = 0;
    const totalHeight = chartDimensions.height;
    const tierCount = balanceTiers.length;

    // Handle edge cases
    if (value === 0) return 0;

    for (let i = 0; i < balanceTiers.length; i++) {
      const tier = balanceTiers[i];
      const tierStart = tier.min;
      const tierEnd = tier.max === Infinity ? Number.MAX_VALUE : tier.max;
      const tierHeight = totalHeight / tierCount;

      if (value >= tierStart && value < tierEnd) {
        const percent = (value - tierStart) / (tierEnd - tierStart || 1);
        pos += percent * tierHeight + 10;
        break;
      } else {
        pos += tierHeight;
      }
    }
    return pos;
  };

  // Threshold positions for tooltips (0 and all tier minimums)
  const xThresholds = useMemo(() => {
    if (!chartDimensions.width) return [] as { pos: number; value: number }[];
    const thresholds: { pos: number; value: number }[] = [{ pos: 0, value: 0 }];
    spentTiers.slice(1).forEach((tier) => {
      thresholds.push({ pos: getXAxisPosition(tier.min), value: tier.min });
    });
    return thresholds;
  }, [chartDimensions.width, spentTiers]);

  const yThresholds = useMemo(() => {
    if (!chartDimensions.height) return [] as { pos: number; value: number }[];
    const thresholds: { pos: number; value: number }[] = [{ pos: 0, value: 0 }];
    balanceTiers.slice(1).forEach((tier) => {
      thresholds.push({ pos: getYAxisPosition(tier.min), value: tier.min });
    });
    return thresholds;
  }, [chartDimensions.height, balanceTiers]);

  const handleXHoverMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!xThresholds.length) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const segmentWidth = rect.width / spentTiers.length;
    let index = Math.floor(x / Math.max(segmentWidth, 1));
    index = Math.max(0, Math.min(index, spentTiers.length - 1));
    setHoveredXIndex(index);

    const center = index * segmentWidth + segmentWidth / 2;
    setHoverX({
      visible: true,
      left: Math.min(Math.max(center, 0), rect.width),
      value: spentTiers[index]?.min ?? 0,
    });
  };
  const handleXHoverLeave = () => {
    setHoverX((prev) => ({ ...prev, visible: false }));
    setHoveredXIndex(null);
  };

  const handleYHoverMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!yThresholds.length) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const xFromLeft = e.clientX - rect.left;
    // Only activate when hovering near the vertical bar (within 20px from the left edge)
    if (xFromLeft > 20) {
      setHoverY((prev) => ({ ...prev, visible: false }));
      setHoveredYIndex(null);
      return;
    }
    const yFromTop = e.clientY - rect.top;
    const height = rect.height;
    const yFromBottom = height - yFromTop;
    const segmentHeight = height / balanceTiers.length;
    let index = Math.floor(yFromBottom / Math.max(segmentHeight, 1));
    index = Math.max(0, Math.min(index, balanceTiers.length - 1));
    setHoveredYIndex(index);

    const center = index * segmentHeight + segmentHeight / 2;
    setHoverY({
      visible: true,
      bottom: Math.min(Math.max(center, 0), height),
      value: balanceTiers[index]?.min ?? 0,
    });
  };
  const handleYHoverLeave = () => {
    setHoverY((prev) => ({ ...prev, visible: false }));
    setHoveredYIndex(null);
  };

  // X-axis (Spent)
  let spentPos = getXAxisPosition(spent);
  const lastSpentTier = spentTiers[spentTiers.length - 1];
  let isSpentMax = false;
  if (lastSpentTier && lastSpentTier.max === Infinity) {
    if (spent >= lastSpentTier.min) {
      const percent = Math.min((spent - lastSpentTier.min) / lastSpentTier.min, 1);
      spentPos =
        getXAxisPosition(lastSpentTier.min) +
        percent * (chartDimensions.width - getXAxisPosition(lastSpentTier.min) - 50);
      if (percent >= 1) isSpentMax = true;
    }
  }
  spentPos = Math.min(spentPos, chartDimensions.width);

  // Y-axis (Balance)
  let balancePos = getYAxisPosition(balance);
  const lastBalanceTier = balanceTiers[balanceTiers.length - 1];
  let isBalanceMax = false;
  if (lastBalanceTier && lastBalanceTier.max === Infinity) {
    if (balance >= lastBalanceTier.min) {
      const percent = Math.min((balance - lastBalanceTier.min) / lastBalanceTier.min, 1);
      balancePos =
        getYAxisPosition(lastBalanceTier.min) +
        percent * (chartDimensions.height - getYAxisPosition(lastBalanceTier.min));
      if (percent >= 1) isBalanceMax = true;
    }
    balancePos = Math.min(balancePos, chartDimensions.height);
  }

  return (
    <div className={`w-full rounded-lg p-2 ${className}`}>
      <div className="p-4 pb-7 font-bold text-lg">{title}</div>
      <div className="flex justify-end">
        <div
          className="relative w-full min-h-[400px] md:min-h-[650px] overflow-hidden"
          ref={chartContainerRef}
          style={isDisabled ? { pointerEvents: 'none' } : {}}
        >
          {isLoading ? (
            <ScatterRankingChartSkeleton />
          ) : !hasData ? (
            // Show no data message
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-500 text-lg font-medium mb-2">Currently no data</div>
                <div className="text-gray-400 text-sm">
                  Please add membership tiers to view the chart
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`transition-all duration-500 ${isChartReady ? 'opacity-100' : 'opacity-0'}`}
            >
              {/* Y-axis Legend (rotated, vertically centered, outside Y labels)
              {!isMobile && (
                <div
                  className="absolute top-0 left-1 flex flex-col justify-center items-center"
                  style={{ height: 'calc(100% - 80px)', width: '40px', zIndex: 2, gap: '10px' }}
                >
                  <LegendYAxis items={yLegend?.items || []} />
                </div>
              )} */}

              {/* Y-axis Labels at grid lines */}
              <div className="absolute left-5 top-0 w-10" style={{ height: 'calc(100% - 80px)' }}>
                {/* Only render 0 at the bottom left */}
                <div
                  className="absolute text-xs text-gray-600 font-semibold whitespace-nowrap overflow-hidden"
                  style={{ bottom: 0, right: 0 }}
                >
                  0
                </div>
                {balanceTiers.map((tier, idx) => {
                  if (idx === 0) return null; // skip 0, already rendered
                  const cellHeight = chartDimensions.height / balanceTiers.length;
                  const bottom = idx * cellHeight;
                  return (
                    <div
                      key={tier.label}
                      className="absolute text-xs text-gray-600 font-semibold whitespace-nowrap overflow-hidden"
                      style={{ bottom: `${bottom}px`, right: 0, transform: 'translateY(50%)' }}
                    >
                      {tier.min.toLocaleString()}
                    </div>
                  );
                })}
              </div>

              {/* X-axis Labels at grid lines */}
              <div className="absolute left-[70px] bottom-10 w-full" style={{ height: 20 }}>
                {spentTiers.map((tier, idx) => {
                  if (idx === 0) return null;
                  const left = getXAxisPosition(tier.min) + 10;
                  return (
                    <div
                      key={tier.label}
                      className="absolute text-xs text-gray-600 font-semibold text-center whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        left: `${left}px`,
                        bottom: 0,
                        transform: 'translateX(-50%)',
                        minWidth: 40,
                      }}
                    >
                      {tier.min.toLocaleString()}
                    </div>
                  );
                })}
              </div>

              {/* Chart Grid Area */}
              <div
                className="absolute top-0 left-[80px] w-[calc(100%-100px)] h-[calc(100%-80px)] grid"
                style={{
                  gridTemplateRows: `repeat(${balanceTiers.length}, 1fr)`,
                  gridTemplateColumns: `repeat(${spentTiers.length}, 1fr)`,
                }}
              >
                {/* Highlight hovered column from X-axis bar */}
                {chartDimensions.width && hoveredXIndex !== null && (
                  <div
                    className="absolute top-0 h-full pointer-events-none z-[6]"
                    style={{
                      left: `${(hoveredXIndex * chartDimensions.width - 22 * hoveredXIndex) / spentTiers.length}px`,
                      width: `${chartDimensions.width / spentTiers.length - 2}px`,
                      background: 'rgba(59,130,246,0.12)',
                    }}
                  />
                )}
                {/* Highlight hovered row from Y-axis bar */}
                {chartDimensions.height && hoveredYIndex !== null && (
                  <div
                    className="absolute left-0 w-full pointer-events-none z-[6]"
                    style={{
                      bottom: `${(hoveredYIndex * chartDimensions.height) / balanceTiers.length}px`,
                      height: `${chartDimensions.height / balanceTiers.length}px`,
                      background: 'rgba(34,197,94,0.12)',
                    }}
                  />
                )}
                {/* Render background grid lines */}
                {balanceTiers
                  .slice(0, -1)
                  .reverse()
                  .map((tier, index) => (
                    <div
                      key={`h-line-${tier.label}`}
                      className="absolute left-0 w-full h-0.5 bg-gray-200 z-5"
                      style={{
                        top: `${(index + 1) * (chartDimensions.height / balanceTiers.length)}px`,
                      }}
                    ></div>
                  ))}
                {spentTiers.slice(1).map((tier) => (
                  <div
                    key={`v-line-${tier.label}`}
                    className="absolute top-0 h-full w-0.5 bg-gray-200 z-5"
                    style={{ left: `${getXAxisPosition(tier.min)}px` }}
                  ></div>
                ))}

                {/* Render actual rank cells with icons + shadcn/ui */}
                {balanceTiers
                  .slice()
                  .reverse()
                  .map((bTier, bIndex) =>
                    spentTiers.map((sTier, sIndex) => {
                      // Lấy item hiện tại (nếu có)
                      const cellKey = `${bTier.label}-${sTier.label}`;
                      const cellItem = combinedTierIcons?.[cellKey]?.item;

                      // Logic kiểm tra isCurrent: so sánh id hoặc key với currentId
                      const isCurrent =
                        currentId !== undefined
                          ? cellItem && cellItem.id === currentId // hoặc so sánh theo logic bạn muốn
                          : userBalanceRank === bTier.label && userSpentRank === sTier.label;

                      if (cellRenderer) {
                        return cellRenderer(bTier, sTier, isCurrent, bIndex, sIndex);
                      }
                      return (
                        <ItemRankChart
                          key={cellKey}
                          bTier={bTier}
                          sTier={sTier}
                          isCurrent={isCurrent}
                          bIndex={bIndex}
                          sIndex={sIndex}
                          combinedTierIcons={combinedTierIcons}
                          customTooltipContent={customTooltipContent}
                          item={cellItem}
                        />
                      );
                    }),
                  )}
              </div>

              {/* Progress Bar Chart for XAxis and YAxis */}
              <div
                className="absolute bottom-20 left-[70px] w-[calc(100%-90px)]"
                onMouseMove={handleXHoverMove}
                onMouseLeave={handleXHoverLeave}
                onMouseEnter={handleXHoverMove}
                onClick={() => {
                  if (hoveredXIndex !== null && onClickXAxisRange) {
                    const tier = spentTiers[hoveredXIndex];
                    if (tier) onClickXAxisRange(tier, hoveredXIndex);
                  }
                }}
              >
                {/* Background bar */}
                <div className="absolute left-0 flex items-center w-[calc(100%-10px)] z-10">
                  <div className="w-full h-2.5" style={{ background: colors.xBg }} />
                </div>
                {/* Highlight hovered column segment */}
                {hoveredXIndex !== null && (
                  <div
                    className="absolute top-0 h-2.5 z-[11] pointer-events-none"
                    style={{
                      left: `calc(${(100 * hoveredXIndex) / spentTiers.length}% )`,
                      width: `calc(${100 / spentTiers.length}% - 0px)`,
                    }}
                  />
                )}
                {/* Arrow head for X-axis */}
                {chartDimensions.width && (
                  <div
                    className="absolute right-0 top-[5px] -translate-y-1/2 w-0 h-0 border-y-[5px] border-l-[10px] z-[11] border-y-transparent"
                    style={{ borderLeftColor: isSpentMax ? '#22c55e' : colors.xBg }}
                  />
                )}
                {/* Current value bar */}
                <div
                  className="h-2.5 absolute left-0 top-0 transition-all duration-700 z-[12]"
                  style={{
                    width: chartDimensions.width ? `${spentPos}px` : 0,
                    background: colors.x,
                  }}
                />
                {hoverX.visible && (
                  <div
                    className="absolute z-[20] px-2 py-1 text-[10px] bg-black text-white rounded pointer-events-none"
                    style={{
                      left: `${hoverX.left}px`,
                      bottom: '14px',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {hoverX.value.toLocaleString()}
                  </div>
                )}
              </div>

              <div
                className={`
                  absolute top-0 left-[70px] 
                  h-[calc(100%-70px)]
                  ${chartDimensions.height ? 'block' : 'hidden'}
                `}
                onMouseMove={handleYHoverMove}
                onMouseLeave={handleYHoverLeave}
                onMouseEnter={handleYHoverMove}
                onClick={() => {
                  if (hoveredYIndex !== null && onClickYAxisRange) {
                    const tier = balanceTiers[hoveredYIndex];
                    if (tier) onClickYAxisRange(tier, hoveredYIndex);
                  }
                }}
              >
                {/* Arrow head for Y-axis */}
                {chartDimensions.height && (
                  <div
                    className={`
                      absolute top-0 left-1/2 
                      w-0 h-0 z-[11] 
                      border-x-[5px] border-b-[10px] border-x-transparent
                      ${chartDimensions.height ? 'block' : 'hidden'}
                    `}
                    style={{ borderBottomColor: isBalanceMax ? '#22c55e' : colors.yBg }}
                  />
                )}
                {/* Background bar */}
                <div
                  className={`
                    absolute flex items-end 
                    w-[10px] z-[10] 
                    top-[10px] 
                    h-[calc(100%-12px)]
                    ${chartDimensions.height ? 'block' : 'hidden'}
                  `}
                >
                  <div className="h-full w-2.5" style={{ background: colors.yBg }} />
                </div>
                {/* Highlight hovered row segment */}
                {hoveredYIndex !== null && (
                  <div
                    className="absolute left-0 w-2.5 z-[11] pointer-events-none"
                    style={{
                      bottom: `calc(${(100 * hoveredYIndex) / balanceTiers.length}% + 0px)`,
                      height: `calc(${100 / balanceTiers.length}% - 0px)`,
                    }}
                  />
                )}
                {/* Current value bar */}
                <div
                  className="w-2.5 absolute left-0 bottom-0 transition-all duration-700 z-[12]"
                  style={{
                    height: chartDimensions.height ? `${balancePos}px` : 0,
                    background: colors.y,
                  }}
                />
                {hoverY.visible && (
                  <div
                    className="absolute z-[20] px-2 py-1 text-[10px] bg-black text-white rounded pointer-events-none"
                    style={{
                      left: '14px',
                      bottom: `${hoverY.bottom}px`,
                      transform: 'translateY(50%)',
                    }}
                  >
                    {hoverY.value.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ScatterRankingChart);

export { default as ScatterRankingChartSkeleton } from './ScatterRankingChartSkeleton';
