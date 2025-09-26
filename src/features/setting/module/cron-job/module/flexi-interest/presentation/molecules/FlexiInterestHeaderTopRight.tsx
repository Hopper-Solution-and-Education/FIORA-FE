import { FC } from 'react';

interface FlexiInterestHeaderTopRightProps {
  total: number;
  current: number;
  totalSuccess: number;
  totalFailed: number;
}

const FlexiInterestHeaderTopRight: FC<FlexiInterestHeaderTopRightProps> = ({
  total,
  totalSuccess,
  totalFailed,
  current,
}) => {
  return (
    <div className=" bg-[#F9FAFB] shadow-lg rounded h-full px-4 py-1">
      <div className="text-xs leading-none mb-1">
        <strong>Show:</strong> {current} / {total}
      </div>
      <div className="text-xs leading-none">
        <strong>
          <span className="text-green-600">S </span>|<span className="text-red-600"> F</span>:
        </strong>
        <span className="text-green-500"> {totalSuccess} </span>|
        <span className="text-red-500"> {totalFailed}</span>
      </div>
    </div>
  );
};

export default FlexiInterestHeaderTopRight;
