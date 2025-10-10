import HorizontalBarChart from '@/components/common/charts/horizontal-bar-chart';
import { ReferralChartItem } from '../../data/dto/response/ReferralChartResponse';

interface ReferralCronjobChartProps {
  chartData: ReferralChartItem[];
  loading?: boolean;
  onBarClick?: (typeOfBenefit: string) => void;
}

const ReferralCronjobChart = ({
  chartData,
  loading = false,
  onBarClick,
}: ReferralCronjobChartProps) => {
  // Convert chart data to display format
  const displayData = chartData.map((item) => ({
    name: item.typeOfBenefit,
    value: item.totalAmount,
    color: '#f87171',
  }));

  const totalAmount = displayData.reduce((sum, item) => sum + item.value, 0);

  const handleBarClick = (item: { name: string; value: number; color: string }) => {
    if (onBarClick) {
      onBarClick(item.name);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors duration-200">
        <div className="flex justify-end items-center mb-4">
          <div className="bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors duration-200">
            Loading...
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="flex justify-end items-center mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors duration-200">
          Total: {totalAmount.toLocaleString()}
        </div>
      </div>

      <div className="relative">
        <HorizontalBarChart
          data={displayData}
          height={300}
          xAxisFormatter={(value) => value.toLocaleString()}
          onBarClick={handleBarClick}
        />
      </div>
    </div>
  );
};

export default ReferralCronjobChart;
