'use client';

export interface TierDataItemProps {
  label: string;
  value: string;
  suffix?: string;
}

const TierDataItem = ({ label, value, suffix }: TierDataItemProps) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-2
        w-full
        overflow-hidden
      "
    >
      {/* Label - Right side */}
      <span
        className="
          text-xs
          sm:text-sm
          md:text-sm
          lg:text-sm
          font-semibold
          text-gray-700
          dark:text-gray-200
          text-right
          flex-shrink-0
        "
      >
        {label}
      </span>
      {/* Value Container - Left side with fixed width */}
      <div
        className="
          flex-shrink-0
          w-20
          text-left
          overflow-hidden
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              text-sm
              md:text-base
              text-gray-800
              dark:text-gray-100
              truncate
            "
            title={value}
          >
            {value}
          </span>
          {/* Suffix */}
          {suffix && (
            <span
              className="
                text-xs
                sm:text-sm
                md:text-sm
                lg:text-sm
                text-gray-500
                dark:text-gray-400
                flex-shrink-0
              "
            >
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TierDataItem;
