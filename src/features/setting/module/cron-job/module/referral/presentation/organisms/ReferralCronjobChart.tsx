import HorizontalBarChart from '@/components/common/charts/horizontal-bar-chart';
import { ReferralChartItem } from '../../data/dto/response/ReferralChartResponse';

interface ReferralCronjobChartProps {
  chartData: ReferralChartItem[];
  loading?: boolean;
}

const ReferralCronjobChart = ({ chartData, loading = false }: ReferralCronjobChartProps) => {
  // Convert chart data to display format
  const displayData = chartData.map((item) => ({
    name: item.typeOfBenefit,
    value: item.totalAmount,
    color: '#f87171',
  }));

  const totalAmount = displayData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-blue-600">Referral Chart</h3>
          <div className="bg-gray-100 text-blue-800 px-3 py-1.5 rounded-lg font-semibold text-sm">
            Loading...
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-blue-600">Referral Chart</h3>
        <div className="bg-gray-100 text-blue-800 px-3 py-1.5 rounded-lg font-semibold text-sm">
          Total: {totalAmount.toLocaleString()}
        </div>
      </div>

      <div className="relative">
        <HorizontalBarChart
          data={displayData}
          height={300}
          xAxisFormatter={(value) => value.toLocaleString()}
        />
      </div>
    </div>
  );
};

export default ReferralCronjobChart;
