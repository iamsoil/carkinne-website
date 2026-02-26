import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceHistoryChartProps {
  data: {
    date: string;
    price: number;
  }[];
}

const PriceHistoryChart = ({ data }: PriceHistoryChartProps) => {
  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `Rs.${(value/100000).toFixed(0)}L`} />
          <Tooltip 
            formatter={(value) => [`Rs.${Number(value).toLocaleString()}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Bar dataKey="price" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;