import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useRef, useState } from 'react';

// Main App component (or you can rename it and import into your main App)
const App = () => {
  const [currentBalance] = useState(35000);
  const [currentSpent] = useState(60000);

  // This data defines the rank tiers and their associated images/labels
  // Y-axis (Balance/Top-up) tiers
  const balanceTiers = [
    {
      label: 'Egg',
      min: 0,
      max: 9999,
      value: 0,
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg',
    },
    {
      label: 'Tortoise',
      min: 10000,
      max: 19999,
      value: 10000,
      icon: 'https://placehold.co/60x60/80ff80/000000?text=Tortoise',
    },
    {
      label: 'Phoenix',
      min: 20000,
      max: 49999,
      value: 20000,
      icon: 'https://placehold.co/60x60/ff8080/000000?text=Phoenix',
    },
    {
      label: 'Qili',
      min: 50000,
      max: 99999,
      value: 50000,
      icon: 'https://placehold.co/60x60/ffff80/000000?text=Qili',
    },
    {
      label: 'Dragon',
      min: 100000,
      max: Infinity,
      value: 100000,
      icon: 'https://placehold.co/60x60/d180ff/000000?text=Dragon',
    },
  ];

  // X-axis (Spent) tiers
  const spentTiers = [
    { label: 'Titan', min: 0, max: 9999, value: 0 },
    { label: 'Silver', min: 10000, max: 19999, value: 10000 },
    { label: 'Gold', min: 20000, max: 49999, value: 20000 },
    { label: 'Platinum', min: 50000, max: 99999, value: 50000 },
    { label: 'Diamond', min: 100000, max: Infinity, value: 100000 },
  ];

  // Ref for the chart container to calculate positions
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 0, height: 0 });

  // Calculate chart dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        // Subtract Y-axis label area (80px) and X-axis label area (80px)
        setChartDimensions({
          width: chartContainerRef.current.offsetWidth - 80,
          height: chartContainerRef.current.offsetHeight - 80,
        });
      }
    };

    updateDimensions(); // Initial dimensions
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Function to get the current balance rank label
  const getBalanceRank = (balance: number) => {
    for (const tier of balanceTiers) {
      if (balance >= tier.min && balance <= tier.max) {
        return tier.label;
      }
    }
    return ''; // Should not happen with correct ranges
  };

  // Function to get the current spent rank label
  const getSpentRank = (spent: number) => {
    for (const tier of spentTiers) {
      if (spent >= tier.min && spent <= tier.max) {
        return tier.label;
      }
    }
    return ''; // Should not happen with correct ranges
  };

  // Determine the user's current rank combination
  const userBalanceRank = getBalanceRank(currentBalance);
  const userSpentRank = getSpentRank(currentSpent);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rank Progress Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full h-[500px] rounded-lg overflow-hidden"
          ref={chartContainerRef}
        >
          {/* Y-axis Labels (Balance) */}
          <div className="absolute left-0 top-0 h-[calc(100%-80px)] w-20 flex flex-col justify-between py-2 pl-2">
            {balanceTiers
              .slice()
              .reverse()
              .map((tier) => (
                <div
                  key={tier.label}
                  className="text-xs text-gray-600 font-semibold flex items-center justify-end pr-2 h-1/5"
                >
                  {tier.max === Infinity
                    ? `>${tier.min.toLocaleString()} FX`
                    : `${tier.min.toLocaleString()} FX`}
                </div>
              ))}
          </div>

          {/* X-axis Labels (Spent) */}
          <div className="absolute bottom-0 left-20 w-[calc(100%-80px)] h-20 flex items-center justify-around px-2">
            {spentTiers.map((tier) => (
              <div
                key={tier.label}
                className="text-xs text-gray-600 font-semibold text-center w-1/5"
              >
                {tier.max === Infinity
                  ? `>${tier.min.toLocaleString()} FX`
                  : `${tier.min.toLocaleString()} FX`}
              </div>
            ))}
          </div>

          {/* Chart Grid Area */}
          <div
            className="absolute top-0 left-20 w-[calc(100%-80px)] h-[calc(100%-80px)] grid"
            style={{
              gridTemplateRows: `repeat(${balanceTiers.length}, 1fr)`,
              gridTemplateColumns: `repeat(${spentTiers.length}, 1fr)`,
            }}
          >
            {/* Render background grid lines */}
            {balanceTiers
              .slice(0, -1)
              .reverse()
              .map(
                (
                  tier,
                  index, // horizontal lines for Balance tiers (exclude 0FX)
                ) => (
                  <div
                    key={`h-line-${tier.label}`}
                    className="absolute left-0 w-full h-0.5 bg-gray-200 z-5"
                    style={{
                      top: `${(index + 1) * (chartDimensions.height / balanceTiers.length)}px`,
                    }}
                  ></div>
                ),
              )}
            {spentTiers.slice(0, -1).map(
              (
                tier,
                index, // vertical lines for Spent tiers (exclude 0FX)
              ) => (
                <div
                  key={`v-line-${tier.label}`}
                  className="absolute top-0 h-full w-0.5 bg-gray-200 z-5"
                  style={{ left: `${(index + 1) * (chartDimensions.width / spentTiers.length)}px` }}
                ></div>
              ),
            )}

            {/* Render actual rank cells with icons + shadcn/ui */}
            {balanceTiers
              .slice()
              .reverse()
              .map(
                (
                  bTier,
                  bIndex, // Reverse for correct rendering order
                ) =>
                  spentTiers.map((sTier, sIndex) => {
                    const isCurrent =
                      userBalanceRank === bTier.label && userSpentRank === sTier.label;
                    return (
                      <TooltipProvider key={`${bTier.label}-${sTier.label}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                flex items-center justify-center p-1 border-t border-l border-gray-200
                                ${bIndex === 0 ? 'border-b-0' : ''} /* No bottom border for the top row (Dragon) */
                                ${sIndex === 0 ? 'border-l-0' : ''} /* No left border for the first column (Titan) */
                                ${isCurrent ? 'bg-green-100 border-green-500 ring-2 ring-green-500 z-10' : 'bg-white hover:bg-gray-50'}
                                rounded-md relative
                              `}
                            >
                              <img
                                src={bTier.icon}
                                alt={`${bTier.label} Icon`}
                                className={`
                                  w-12 h-12 md:w-16 md:h-16 object-contain
                                  ${isCurrent ? 'scale-110' : ''}
                                `}
                                onError={(e: any) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    'https://placehold.co/60x60/cccccc/000000?text=Icon';
                                }} // Fallback image
                              />
                              {isCurrent && (
                                <Badge variant="default" className="absolute top-1 right-1 text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <strong>
                                {bTier.label} - {sTier.label}
                              </strong>
                              <div>
                                Balance: {bTier.min.toLocaleString()} -{' '}
                                {bTier.max === Infinity ? '∞' : bTier.max.toLocaleString()} FX
                              </div>
                              <div>
                                Spent: {sTier.min.toLocaleString()} -{' '}
                                {sTier.max === Infinity ? '∞' : sTier.max.toLocaleString()} FX
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }),
              )}
          </div>

          {/* Explicit X-axis line (blue) */}
          <div className="absolute bottom-[79px] left-20 w-[calc(100%-80px)] h-1 bg-blue-500 z-10"></div>
          {/* Explicit Y-axis line (green) */}
          <div className="absolute left-[79px] top-0 h-[calc(100%-80px)] w-1 bg-green-500 z-10"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default App;
