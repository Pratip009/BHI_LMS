import React, { FC, useMemo, Component, ReactNode } from 'react';
import { styles } from '../../../styles/style';
import { useGetOrdersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Loader from '../../Loader/Loader';

type Props = {
  isDashboard: boolean;
};

// Error Boundary to catch rendering errors
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div className="text-red-500">Chart rendering failed.</div>;
    }
    return this.props.children;
  }
}

const OrderAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading, error } = useGetOrdersAnalyticsQuery({});

  const formatMonth = (month: string) => {
    const [day, monthName, year] = month.split(' ');
    return `${monthName} ${year}`;
  };

  const analyticsData = useMemo(() => {
    if (!data?.orders?.last12Months) return [];

    const monthMap = new Map<string, number>();
    data.orders.last12Months.forEach((item: any) => {
      if (!item.month || item.count === undefined) return;
      const monthName = formatMonth(item.month);
      const count = Number(item.count) || 0;
      monthMap.set(monthName, (monthMap.get(monthName) || 0) + count);
    });

    return Array.from(monthMap, ([name, Count]) => ({ name, Count }));
  }, [data]);

  if (isLoading) return <Loader />;
  if (error) return <div className="text-red-500">Failed to load analytics.</div>;
  if (analyticsData.length === 0) return <p className="text-gray-500 text-center mt-10">No analytics data available.</p>;

  return (
    <ErrorBoundary>
      <div className="w-full flex flex-col">
        <div className="w-full bg-white dark:bg-[#0E1A38] shadow-md rounded-2xl p-6">
          <h1 className={`${styles.title} !text-start ${isDashboard ? 'text-xl' : 'text-2xl'}`}>Orders Analytics</h1>
          

          <div className="w-full mt-6" style={{ height: isDashboard ? 300 : 500 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, (dataMax: number) => Math.max(dataMax, 5)]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}
                />
                {!isDashboard && <Legend />}
                <Line
                  type="monotone"
                  dataKey="Count"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default OrderAnalytics;
