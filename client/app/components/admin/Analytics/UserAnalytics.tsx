import React, { FC } from 'react';
import { useGetUsersAnalyticsQuery } from '@/redux/features/analytics/analyticsApi';
import { styles } from '../../../styles/style';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Loader from '../../Loader/Loader';

type Props = {
    isDashboard?: boolean;
};

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
    const { data, isLoading } = useGetUsersAnalyticsQuery({});
    const analyticsData: any[] = [];

    data && data.users.last12Months.forEach((item: any) => {
        analyticsData.push({ name: item.month, count: item.count });
    });

    if (isLoading) return <Loader />;

    return (
        <div className={`w-full ${isDashboard ? '' : 'min-h-screen px-2 mt-20'} ${isDashboard ? '' : 'px-2'}`}>
            <div
                className={`w-full rounded-2xl ${isDashboard ? '' : 'max-w-6xl mx-auto bg-white dark:bg-[#1e1e2f] shadow-md p-6'}`}
            >
                {!isDashboard && (
                    <div className="mb-4">
                        <h1 className={`${styles.title} text-2xl`}>
                            Users Analytics
                        </h1>
                    </div>
                )}

                <div style={{ width: '100%', height: isDashboard ? 200 : 500 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={analyticsData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4d62d9" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#4d62d9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#4d62d9"
                                fill="url(#colorCount)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UserAnalytics;
