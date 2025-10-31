import { useQuery } from '@tanstack/react-query';
import { getPurchasedCategories } from '../api/analyticsApi';
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
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);

const CategoryChart = ({ filters }) => {
    const {
        data: response,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['purchasedCategories', filters],
        queryFn: () => getPurchasedCategories(filters),
    });

    const chartData = (response?.data || [])
        .map((cat) => ({
            name: cat.category_name,
            Revenue: Number(cat.total_amount || 0),
        }))
        .sort((a, b) => a.Revenue - b.Revenue);

    const topCategory = chartData[chartData.length - 1];

    return (
        <ChartContainer title="Top Categories by Revenue" isLoading={isLoading}>
            {isError ? (
                <DataErrorState message={error.message} />
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Revenue" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <ChartInsights>
                        <p>
                            Your top performing category is{' '}
                            <span className="font-semibold text-gray-900">
                                {topCategory?.name || 'N/A'}
                            </span>
                            , which generated{' '}
                            <span className="font-semibold text-green-600">
                                {formatCurrency(topCategory?.Revenue || 0)}
                            </span>{' '}
                            in sales for this period.
                        </p>
                    </ChartInsights>
                </>
            )}
        </ChartContainer>
    );
};

export default CategoryChart;