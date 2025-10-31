// components/RevenueChart.jsx

import { useQuery } from '@tanstack/react-query';
import { getSoldProducts } from '../api/analyticsApi';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ChartContainer, DataErrorState, ChartInsights } from './ChartComponents';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);

const RevenueChart = ({ filters }) => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['soldProducts', filters],
        queryFn: () => getSoldProducts(filters),
    });

    const soldProducts = response?.data || [];

    const aggregatedDailyData = soldProducts
        .flatMap((product) => product.daily_data)
        .reduce((acc, day) => {
            const dayStr = day.day_of_week;
            if (!acc[dayStr]) {
                acc[dayStr] = { total_amount: 0, day_of_week: day.day_of_week };
            }
            // ✅ FIX: Coerce day.total_amount to a number before adding
            acc[dayStr].total_amount += +day.total_amount;
            return acc;
        }, {});

    const chartData = Object.values(aggregatedDailyData)
        .sort((a, b) => a.day_of_week - b.day_of_week)
        .map((d) => ({
            name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.day_of_week],
            // ✅ FIX: Ensure the final value is a number
            Revenue: +d.total_amount,
        }));

    const totalRevenue = chartData.reduce((acc, item) => acc + item.Revenue, 0);
    const bestDay = chartData.sort((a, b) => b.Revenue - a.Revenue)[0];

    return (
        <ChartContainer title="Revenue" isLoading={isLoading}>
            {isError ? (
                <DataErrorState message={error.message} />
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Revenue"
                                stroke="#8884d8"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <ChartInsights>
                        <p>
                            You generated{' '}
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(totalRevenue)}
                            </span>{' '}
                            in revenue from your top products during this period.
                            Your best performing day was{' '}
                            <span className="font-semibold text-gray-900">
                                {bestDay?.name}
                            </span>
                            , contributing{' '}
                            <span className="font-semibold text-green-600">
                                {formatCurrency(bestDay?.Revenue || 0)}
                            </span>
                            .
                        </p>
                    </ChartInsights>
                </>
            )}
        </ChartContainer>
    );
};

export default RevenueChart;