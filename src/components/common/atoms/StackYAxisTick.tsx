'use client';
import { IconDisplay } from '@/components/common/atoms/IconDisplay';
import { throttle } from 'lodash';
import type React from 'react';
import { memo, useState } from 'react';
import { CommonTooltip } from './CommonTooltip';

const THROTTLE_DELAY = 300;

interface StackYAxisTick {
  x: number;
  y: number;
  payload: any;
  processedData: any;
  callback?: (item: any) => void;
  setShowAll?: () => void;
}

const StackYAxisTick: React.FC<StackYAxisTick> = ({
  x,
  y,
  payload,
  processedData,
  callback,
  setShowAll,
}) => {
  const item = processedData[payload.index];
  const [isIconHovered, setIsIconHovered] = useState(false);

  const throttledCallback = throttle(
    (callback, item) => {
      callback(item);
    },
    THROTTLE_DELAY,
    { leading: true, trailing: false },
  );

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item?.isOthers && setShowAll) {
      setShowAll();
    } else if (callback && item) {
      throttledCallback(callback, item);
    }
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <CommonTooltip content={payload.value}>
        <foreignObject
          x={-40}
          y={-16}
          width={32}
          height={32}
          onMouseEnter={() => setIsIconHovered(true)}
          onMouseLeave={() => setIsIconHovered(false)}
        >
          <IconDisplay
            icon={item?.icon || 'activity'}
            isHovered={isIconHovered}
            onClick={handleIconClick}
          />
        </foreignObject>
      </CommonTooltip>
    </g>
  );
};

export default memo(StackYAxisTick);
