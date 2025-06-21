import { memo, useEffect, useRef, useState } from 'react';
import ItemRankChart from './ItemRankChart';
import LegendXAxis from './LegendXAxis';
import LegendYAxis from './LegendYAxis';
import ProgressBarChart from './ProgressBarChart';
import { defaultBarColors, ScatterChartProps } from './types';
import { getBalanceRank, getSpentRank } from './utils';

const ScatterRankingChart = ({
  currentTier,
  balanceTiers,
  spentTiers,
  title = 'Rank Progress Chart',
  className = '',
  barColors = {},
  xLegend,
  yLegend,
  cellRenderer,
  combinedTierIcons,
  customTooltipContent,
}: ScatterChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  const balance = currentTier?.balance ?? 0;
  const spent = currentTier?.spent ?? 0;

  const colors = { ...defaultBarColors, ...barColors };

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

  const userBalanceRank = getBalanceRank(balance, balanceTiers);
  const userSpentRank = getSpentRank(spent, spentTiers);

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
        const percent = (value - tierMin) / (tierMax - tierMin || 1); // Avoid division by zero
        if (i > 1) {
          return i * tierWidth + percent * tierWidth - (tierCount + 0.5 + i) * i;
        }
        return i * tierWidth + percent * tierWidth - 1;
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

  return (
    <div className={`w-full rounded-lg p-2 ${className}`}>
      <div className="p-4 pb-7 font-bold text-lg">{title}</div>
      <div className="flex justify-end">
        <div className="relative w-full h-[600px] overflow-hidden" ref={chartContainerRef}>
          {/* Y-axis Legend (rotated, vertically centered, outside Y labels) */}
          <div
            className="absolute top-0 left-1 flex flex-col justify-center items-center"
            style={{ height: 'calc(100% - 80px)', width: '40px', zIndex: 2, gap: '10px' }}
          >
            <LegendYAxis items={yLegend?.items || []} />
          </div>

          {/* Y-axis Labels at grid lines */}
          <div className="absolute left-5 top-0 w-20" style={{ height: 'calc(100% - 80px)' }}>
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
          <div className="absolute left-[100px] bottom-10 w-full" style={{ height: 20 }}>
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

          {/* X-axis Legend (centered below chart grid) */}
          <div
            className="absolute left-1/2"
            style={{ transform: 'translateX(-50%)', bottom: '8px', zIndex: 2 }}
          >
            <LegendXAxis items={xLegend?.items || []} />
          </div>

          {/* Chart Grid Area */}
          <div
            className="absolute top-0 left-[120px] w-[calc(100%-140px)] h-[calc(100%-80px)] grid"
            style={{
              gridTemplateRows: `repeat(${balanceTiers.length}, 1fr)`,
              gridTemplateColumns: `repeat(${spentTiers.length}, 1fr)`,
            }}
          >
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
                  const isCurrent =
                    userBalanceRank === bTier.label && userSpentRank === sTier.label;

                  if (cellRenderer) {
                    return cellRenderer(bTier, sTier, isCurrent, bIndex, sIndex);
                  }
                  return (
                    <ItemRankChart
                      key={`${bTier.label}-${sTier.label}`}
                      bTier={bTier}
                      sTier={sTier}
                      isCurrent={isCurrent}
                      bIndex={bIndex}
                      sIndex={sIndex}
                      combinedTierIcons={combinedTierIcons}
                      customTooltipContent={customTooltipContent}
                    />
                  );
                }),
              )}
          </div>

          {/* Progress Bar Chart for XAxis and YAxis */}
          <ProgressBarChart
            currentTier={{ balance, spent }}
            chartDimensions={chartDimensions}
            balanceTiers={balanceTiers}
            spentTiers={spentTiers}
            colors={colors}
            getXAxisPosition={getXAxisPosition}
            getYAxisPosition={getYAxisPosition}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ScatterRankingChart);
