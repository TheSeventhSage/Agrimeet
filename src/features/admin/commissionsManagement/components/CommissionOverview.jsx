// admin/commission/components/CommissionOverview.jsx
import { useState, useEffect } from 'react';
import {
    DollarSign,
    TrendingUp,
    ShoppingBag,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar
} from 'lucide-react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import adminCommissionService from '../api/adminCommissionService';
// Components
import { Loading } from '../../../../shared/components/Loader'

const CommissionOverview = () => {
    const [stats, setStats] = useState({
        total_commission_earned: 0,
        total_seller_payouts: 0,
        pending_payouts: 0,
        paid_payouts: 0,
        total_orders_with_commission: 0,
        average_commission_per_order: 0
    });
    const [dailyBreakdown, setDailyBreakdown] = useState([]);
    const [period, setPeriod] = useState('month');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch overview with the selected period
                const statsRes = await adminCommissionService.getCommissionOverview(period);
                console.log(statsRes.data);
                // const statsData = ;
                // console.log(statsData)

                // Fetch daily breakdown
                const breakdownRes = await adminCommissionService.getDailyBreakdown(30);

                // 1. Handle Stats Data
                setStats(Object.fromEntries(
                    Object.entries(statsRes.data).map(([key, value]) => [key, typeof value === 'number' ? Number(value) : value])
                ));
                console.log(Object.fromEntries(
                    Object.entries(statsRes.data).map(([key, value]) => [key, typeof value === 'number' ? Number(value) : value])
                ))
                // console.log(stats)

                // 2. Handle & Transform Breakdown Data
                // The API returns strings for amounts ("40749.60"), so we map them to floats for the chart.
                const rawBreakdown = breakdownRes.data.data || breakdownRes.data || [];
                const formattedBreakdown = rawBreakdown.map(item => ({
                    date: item.date,
                    total_commission: parseFloat(item.total_commission || 0),
                    total_seller_payout: parseFloat(item.total_seller_payout || 0),
                    order_count: parseInt(item.order_count || 0, 10)
                }));

                // Sort by date just in case
                formattedBreakdown.sort((a, b) => new Date(a.date) - new Date(b.date));

                setDailyBreakdown(formattedBreakdown);

            } catch (error) {
                console.error('Failed to load overview data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [period]);

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value || 0);
    };

    // Data for the Payout Distribution Pie Chart
    const payoutDistributionData = [
        { name: 'Paid', value: parseFloat(stats.paid_payouts || 0), color: '#3B82F6' }, // Blue
        { name: 'Pending', value: parseFloat(stats.pending_payouts || 0), color: '#EAB308' } // Yellow
    ].filter(item => item.value > 0);

    const statCards = [
        {
            label: 'Total Commission',
            value: formatCurrency(stats.total_commission_earned),
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            label: 'Pending Payouts',
            value: formatCurrency(stats.pending_payouts),
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            label: 'Orders',
            value: stats.total_orders_with_commission || 0,
            icon: ShoppingBag,
            color: 'bg-purple-500'
        },
        {
            label: 'Avg. Commission',
            value: formatCurrency(stats.average_commission_per_order),
            icon: TrendingUp,
            color: 'bg-blue-500'
        },
    ];

    if (isLoading) {
        return (
            <Loading />
        );
    }

    // Custom Tooltip for the Main Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-100 shadow-lg rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">{new Date(label).toLocaleDateString()}</p>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-gray-600">Commission:</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(payload.find(p => p.dataKey === 'total_commission')?.value)}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-gray-600">Seller Payout:</span>
                            <span className="font-medium text-gray-900">
                                {formatCurrency(payload[0]?.payload?.total_seller_payout)}
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span className="text-gray-600">Orders:</span>
                            <span className="font-medium text-gray-900">
                                {payload.find(p => p.dataKey === 'order_count')?.value}
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header / Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-xs">
                    <Calendar className="w-4 h-4 text-gray-500 ml-2" />
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="border-none text-sm text-gray-700 focus:ring-0 cursor-pointer py-1 pr-8 bg-transparent"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className={`p-3 rounded-lg ${stat.color} w-[25%]`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900 mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart (Composed: Bar + Line) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-500" />
                            Commission & Order Trends
                        </h3>
                    </div>

                    <div className="h-80 w-full">
                        {dailyBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={dailyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).getDate()}
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{ value: 'Days', position: 'insideBottom', offset: -10 }}
                                    />
                                    {/* Left Axis: Currency */}
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: 10 }}
                                    />
                                    {/* Right Axis: Order Count */}
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#9CA3AF"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                    <Bar
                                        yAxisId="left"
                                        dataKey="total_commission"
                                        name="Commission ($)"
                                        fill="#10B981"
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="order_count"
                                        name="Order Count"
                                        stroke="#F97316"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: "#F97316" }}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
                                No trend data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Payout Distribution Chart */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-gray-500" />
                        Payout Status
                    </h3>
                    <div className="h-60 w-full relative">
                        {payoutDistributionData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={payoutDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {payoutDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                <AlertCircle className="w-8 h-8 mb-2 text-gray-300" />
                                <span className="text-sm">No payout data</span>
                            </div>
                        )}
                        {/* Center Text Overlay */}
                        {payoutDistributionData.length > 0 && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                                <p className="text-xs text-gray-500">Total Payouts</p>
                                <p className="text-sm font-bold text-gray-900">
                                    {formatCurrency(stats.total_seller_payouts)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionOverview;