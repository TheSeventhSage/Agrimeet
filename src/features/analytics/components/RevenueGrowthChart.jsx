// components/RevenueGrowthChart.jsx

import { useQuery } from '@tanstack/react-query';
import { getRevenueGrowth } from '../api/analyticsApi';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ChartContainer, DataErrorState, ChartInsights } from './ChartComponents';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
    }).format(amount);

// Array of month names
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RevenueGrowthChart = ({ filters }) => {
    // We'll use a default filter for 'year' if nothing is passed
    // The endpoint defaults to 'month' with 12 months, but 'year' is also a good option
    const defaultFilters = { filter: 'year', ...filters };

    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        // Note: We modify the queryKey to include our default
        queryKey: ['revenueGrowth', defaultFilters],
        queryFn: () => getRevenueGrowth(defaultFilters),
    });

    // The data is directly in response.data as per your doc
    const chartData = (response?.data || [])
        .map((item) => ({
            // Create a name like "Oct 2025"
            name: `${monthNames[item.month - 1]} ${item.year}`,
            Revenue: Number(item.total_amount || 0),
        }))
        .sort((a, b) => {
            // Ensure data is chronological
            const [aMonth, aYear] = a.name.split(' ');
            const [bMonth, bYear] = b.name.split(' ');
            const aDate = new Date(`${aMonth} 1, ${aYear}`);
            const bDate = new Date(`${bMonth} 1, ${bYear}`);
            return aDate - bDate;
        });

    const totalRevenue = chartData.reduce((acc, item) => acc + item.Revenue, 0);
    const avgMonthlyRevenue = totalRevenue / (chartData.length || 1);

    return (
        <ChartContainer title="Monthly Revenue Growth" isLoading={isLoading}>
            {isError ? (
                <DataErrorState message={error.message} />
            ) : chartData.length === 0 ? (
                <DataErrorState message="No revenue data found for this period." />
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
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
                                tickFormatter={(value) => `₦${value / 1000}k`}
                            />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar
                                dataKey="Revenue"
                                fill="#8884d8"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <ChartInsights>
                        <p>
                            You generated{' '}
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(totalRevenue)}
                            </span>{' '}
                            this period, with an average of{' '}
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(avgMonthlyRevenue)}
                            </span>{' '}
                            per month.
                        </p>
                    </ChartInsights>
                </>
            )}
        </ChartContainer>
    );
};

export default RevenueGrowthChart;