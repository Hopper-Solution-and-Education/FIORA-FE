import {
  CombinedTierIcon,
  ItemRankChartProps,
  Tier,
} from '@/components/common/charts/scatter-rank-chart/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { memo, useCallback } from 'react';

const getCombinedIcon = (
  bTier: Tier,
  sTier: Tier,
  combinedTierIcons: Record<string, CombinedTierIcon>,
) => {
  const combinedKey = `${bTier.label}-${sTier.label}`;
  return combinedTierIcons?.[combinedKey];
};

const ItemRankChart = ({
  bTier,
  sTier,
  isCurrent,
  combinedTierIcons,
  item,
  customTooltipContent,
}: ItemRankChartProps) => {
  const renderToolTipContent = (bTier: Tier, sTier: Tier) => {
    return (
      <div className="flex flex-col text-xs">
        <strong>{item?.tierName}</strong>
        <div>
          Balance: {bTier.min.toLocaleString()} -{' '}
          {bTier.max === Infinity ? '∞' : bTier.max.toLocaleString()} FX
        </div>
        <div>
          Spent: {sTier.min.toLocaleString()} -{' '}
          {sTier.max === Infinity ? '∞' : sTier.max.toLocaleString()} FX
        </div>
      </div>
    );
  };

  const combinedKey = `${bTier.label}-${sTier.label}`;
  const tierIcon = getCombinedIcon(bTier, sTier, combinedTierIcons || {});

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (tierIcon?.onClick) {
        tierIcon.onClick(bTier, sTier, tierIcon.item);
      }
    },
    [tierIcon, bTier, sTier],
  );

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0} disableHoverableContent>
        <TooltipTrigger asChild>
          <div
            onClick={handleClick}
            className={`
              cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800
              flex items-center justify-center border border-gray-200 dark:border-gray-800
              ${isCurrent ? 'bg-green-100 dark:bg-gray-800 border-green-500 z-10' : 'bg-white dark:bg-black hover:bg-gray-50'}
              relative w-full h-full
            `}
          >
            {tierIcon && (
              <div className="w-full h-full p-1 flex items-center justify-center">
                <div className="relative w-full h-full max-w-[85px] max-h-[85px] min-w-[40px] min-h-[40px]">
                  {isCurrent ? (
                    <Image
                      src={tierIcon.mainIcon || ''}
                      alt={combinedKey}
                      fill
                      className="object-contain transition-transform duration-200 scale-110"
                    />
                  ) : tierIcon.isPassed ? (
                    <Image
                      src={tierIcon.passedIcon || ''}
                      alt={combinedKey}
                      fill
                      className="object-contain transition-transform duration-200 scale-100"
                    />
                  ) : (
                    <Image
                      src={tierIcon.inActiveIcon || ''}
                      alt={combinedKey}
                      fill
                      className="object-contain transition-transform duration-200 scale-100"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="z-50 bg-white text-black dark:bg-black dark:text-white shadow-lg"
        >
          {customTooltipContent
            ? customTooltipContent(bTier, sTier)
            : renderToolTipContent(bTier, sTier)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(ItemRankChart);
