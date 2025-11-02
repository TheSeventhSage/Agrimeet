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

// Day of week mapping (Adjust array if your week starts differently)
// Assuming 1=Sun, 2=Mon, 3=Tue, 4=Wed, 5=Thu, 6=Fri, 7=Sat
const dayNames = [
    'Sun', // index 0 (for day_of_week 1)
    'Mon', // index 1 (for day_of_week 2)
    'Tue', // index 2 (for day_of_week 3)
    'Wed', // index 3 (for day_of_week 4)
    'Thu', // index 4 (for day_of_week 5)
    'Fri', // index 5 (for day_of_week 6)
    'Sat', // index 6 (for day_of_week 7)
];

// Colors for the product lines
const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#0088FE'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, soldProducts }) => {
    if (active && payload && payload.length && soldProducts) {
        return (
            <div className="bg-white p-3 shadow-xl rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900 text-lg mb-2">{label}</p>
                {payload.map((pld) => {
                    // Find the full product info from the original API response
                    const product = soldProducts.find(
                        (p) => p.product_name === pld.dataKey
                    );
                    if (!product) return null;

                    return (
                        <div
                            key={pld.dataKey}
                            className="flex items-center gap-3 py-2"
                        >
                            {/* You may need to prefix this path */}
                            <img
                                src={product.product_photo}
                                alt={product.product_name}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <p
                                    style={{ color: pld.color }}
                                    className="font-semibold"
                                >
                                    {pld.dataKey}
                                </p>
                                <p className="text-sm text-gray-700">
                                    Day's Revenue:{' '}
                                    <strong>{formatCurrency(pld.value)}</strong>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Total Sales: {product.sales_count}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Total Revenue:{' '}
                                    {formatCurrency(product.total_amount)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

// RevenueChart Component
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

    // ✅ FIX: Changed response?.data?.json back to response?.data
    const soldProducts = response?.data || [];

    // Data Transformation for multiple product lines
    const { dayMap, productNames } = soldProducts.reduce(
        (acc, product) => {
            // Add product name to our list
            if (!acc.productNames.includes(product.product_name)) {
                acc.productNames.push(product.product_name);
            }

            // Map daily data to the correct day
            product.daily_data.forEach((day) => {
                const dayIndex = day.day_of_week; // e.g., 2 for Monday

                // Initialize day if it doesn't exist
                if (!acc.dayMap[dayIndex]) {
                    acc.dayMap[dayIndex] = {
                        // Use dayIndex - 1 for 0-based array
                        name: dayNames[dayIndex - 1] || `Day ${dayIndex}`,
                        day_index: dayIndex, // Store original index for sorting
                    };
                }

                // Add product's revenue for that day
                acc.dayMap[dayIndex][product.product_name] = Number(
                    day.total_amount || 0
                );
            });

            return acc;
        },
        { dayMap: {}, productNames: [] }
    );

    // Convert the dayMap into a sorted array for the chart
    const finalChartData = Object.values(dayMap).sort(
        (a, b) => a.day_index - b.day_index
    );

    // ✅ NEW: Re-calculate insights based on new data structure
    const { bestDay, totalRevenue } = finalChartData.reduce(
        (acc, day) => {
            // Calculate total for the day by summing all product keys
            const dayTotal = productNames.reduce((sum, productName) => {
                return sum + (day[productName] || 0);
            }, 0);

            // Check if this is the best day
            if (dayTotal > acc.bestDay.total) {
                acc.bestDay.total = dayTotal;
                acc.bestDay.name = day.name;
            }
            return acc;
        },
        { bestDay: { name: 'N/A', total: 0 } }
    );

    // Calculate total revenue from the source data
    const totalPeriodRevenue = soldProducts.reduce((acc, p) => acc + Number(p.total_amount || 0), 0);

    return (
        <ChartContainer title="Top Products Revenue by Day" isLoading={isLoading}>
            {isError ? (
                <DataErrorState message={error.message} />
            ) : finalChartData.length === 0 ? (
                <DataErrorState message="No sales data found for this period." />
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={finalChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip
                                content={
                                    <CustomTooltip
                                        soldProducts={soldProducts}
                                    />
                                }
                            />
                            <Legend wrapperStyle={{ fontSize: 12 }} />

                            {/* Render a line for each product */}
                            {productNames.map((name, index) => (
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

                    {/* ✅ NEW: Updated ChartInsights to use new calculations */}
                    <ChartInsights>
                        <p>
                            You generated{' '}
                            <span className="font-semibold text-gray-900">
                                {formatCurrency(totalPeriodRevenue)}
                            </span>{' '}
                            in revenue from your top products during this period.
                            Your best performing day was{' '}
                            <span className="font-semibold text-gray-900">
                                {bestDay.name}
                            </span>
                            , contributing{' '}
                            <span className="font-semibold text-green-600">
                                {formatCurrency(bestDay.total)}
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