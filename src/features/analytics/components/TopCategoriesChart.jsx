// components/TopCategoriesChart.jsx

import { useQuery } from '@tanstack/react-query';
import { getTopCategories } from '../api/analyticsApi';
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

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TopCategoriesChart = ({ filters }) => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['topCategories', filters],
        queryFn: () => getTopCategories(filters),
    });

    const categoryData = response?.data || [];

    const transformData = () => {
        const allMonths = new Set();
        const categoryMap = {};

        categoryData.forEach(category => {
            category.monthly_data.forEach(monthData => {
                allMonths.add(monthData.month);
            });
        });

        const sortedMonths = Array.from(allMonths).sort((a, b) => a - b);

        return sortedMonths.map(monthNum => {
            const chartEntry = { name: monthNames[monthNum - 1] };
            categoryData.forEach(category => {
                const monthData = category.monthly_data.find(m => m.month === monthNum);
                // ✅ FIX: Coerce total_amount to a number, default to 0
                chartEntry[category.category_name] = monthData ? +monthData.total_amount : 0;
            });
            return chartEntry;
        });
    };

    const chartData = transformData();
    const categoryNames = categoryData.map(c => c.category_name);

    return (
        <ChartContainer title="Top Categories (Monthly Trend)" isLoading={isLoading}>
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
                            {categoryNames.map((name, index) => (
                                <Line
                                    key={name}
                                    type="monotone"
                                    dataKey={name}
                                    stroke={PIE_COLORS[index % PIE_COLORS.length]}
                                    strokeWidth={2}
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                    <ChartInsights>
                        <p>
                            This chart shows the revenue trend for your top 4 categories
                            over the selected period.
                        </p>
                    </ChartInsights>
                </>
            )}
        </ChartContainer>
    );
};

export default TopCategoriesChart;