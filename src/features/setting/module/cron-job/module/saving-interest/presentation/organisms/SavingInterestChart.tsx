import { VerticalBarChart } from '@/components/common/charts';
import { SavingInterestChartItem } from '../../data/dto/response/SavingInterestResponse';

interface SavingInterestChartProps {
  chartData: SavingInterestChartItem[];
  loading?: boolean;
  onBarClick?: (tierName: string) => void;
}

const SavingInterestChart = ({
  chartData,
  loading = false,
  onBarClick,
}: SavingInterestChartProps) => {
  // Convert chart data to display format
  const displayData = chartData.map((item) => ({
    name: item.tierName,
    value: parseFloat(item.interestAmount) || 0,
    color: '#ef4444', // Red color as shown in the image
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
          Total: {totalAmount.toLocaleString()} FX
        </div>
      </div>

      <div className="relative">
        <VerticalBarChart
          data={displayData}
          height={300}
          yAxisFormatter={(value) => value.toLocaleString()}
          onBarClick={handleBarClick}
        />
      </div>
    </div>
  );
};

export default SavingInterestChart;
