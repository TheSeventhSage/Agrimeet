// components/OrderAnalytics.jsx
import { TrendingUp, Package, Users, CreditCard, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { STATUS_CONFIG } from '../api/orderService';

const OrderAnalytics = ({ orderStats, isLoading }) => {
    if (isLoading || !orderStats) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded-sm w-3/4 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded-sm w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded-sm w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };

    const calculatePercentageChange = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    // Mock previous period data for comparison
    const previousPeriod = {
        total: 45,
        pending: 8,
        processing: 12,
        shipped: 15,
        delivered: 28,
        cancelled: 3,
        totalRevenue: 850000
    };

    const statsCards = [
        {
            title: 'Total Orders',
            value: orderStats.total,
            previousValue: previousPeriod.total,
            icon: Package,
            color: 'blue'
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(orderStats.totalRevenue),
            rawValue: orderStats.totalRevenue,
            previousValue: previousPeriod.totalRevenue,
            icon: CreditCard,
            color: 'green'
        },
        {
            title: 'Average Order Value',
            value: formatCurrency(Math.round(orderStats.totalRevenue / orderStats.total || 0)),
            rawValue: orderStats.totalRevenue / orderStats.total,
            previousValue: previousPeriod.totalRevenue / previousPeriod.total,
            icon: TrendingUp,
            color: 'purple'
        },
        {
            title: 'Completed Orders',
            value: orderStats.delivered,
            previousValue: previousPeriod.delivered,
            icon: Users,
            color: 'emerald'
        }
    ];

    const statusBreakdown = [
        {
            status: 'pending',
            label: 'Pending',
            value: orderStats.pending,
            previousValue: previousPeriod.pending,
            config: STATUS_CONFIG.pending
        },
        {
            status: 'processing',
            label: 'Processing',
            value: orderStats.processing,
            previousValue: previousPeriod.processing,
            config: STATUS_CONFIG.processing
        },
        {
            status: 'shipped',
            label: 'Shipped',
            value: orderStats.shipped,
            previousValue: previousPeriod.shipped,
            config: STATUS_CONFIG.shipped
        },
        {
            status: 'delivered',
            label: 'Delivered',
            value: orderStats.delivered,
            previousValue: previousPeriod.delivered,
            config: STATUS_CONFIG.delivered
        }
    ];

    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        green: 'bg-green-50 border-green-200 text-green-600',
        purple: 'bg-purple-50 border-purple-200 text-purple-600',
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600'
    };

    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat) => {
                        const IconComponent = stat.icon;
                        const change = calculatePercentageChange(
                            stat.rawValue || stat.value,
                            stat.previousValue
                        );
                        const isPositive = parseFloat(change) >= 0;

                        return (
                            <div key={stat.title} className={`border rounded-xl p-6 ${colorClasses[stat.color]}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium opacity-80 mb-1">{stat.title}</p>
                                        <h4 className="text-2xl font-bold">
                                            {stat.value}
                                        </h4>
                                    </div>
                                    <IconComponent className="w-8 h-8 opacity-80" />
                                </div>

                                <div className="flex items-center text-sm">
                                    {isPositive ? (
                                        <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                                    )}
                                    <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        {Math.abs(change)}%
                                    </span>
                                    <span className="text-gray-600 ml-1">vs last period</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Order Status Breakdown */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statusBreakdown.map((item) => {
                        const change = calculatePercentageChange(item.value, item.previousValue);
                        const isPositive = parseFloat(change) >= 0;
                        const percentage = ((item.value / orderStats.total) * 100).toFixed(1);

                        return (
                            <div key={item.status} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${item.config.badgeColor}`}></div>
                                            <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                        </div>
                                        <h4 className="text-3xl font-bold text-gray-900">{item.value}</h4>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">{percentage}% of total</span>
                                        <div className="flex items-center">
                                            {isPositive ? (
                                                <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
                                            ) : (
                                                <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
                                            )}
                                            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {Math.abs(change)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${item.config.badgeColor}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Performance Metrics */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Fulfillment Rate */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Fulfillment Rate</h4>
                            <Package className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-end space-x-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {((orderStats.delivered / (orderStats.total - orderStats.cancelled)) * 100 || 0).toFixed(1)}%
                                </span>
                                <div className="flex items-center text-sm text-green-600 mb-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>+5.2%</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600">
                                {orderStats.delivered} of {orderStats.total - orderStats.cancelled} orders delivered
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                        width: `${((orderStats.delivered / (orderStats.total - orderStats.cancelled)) * 100 || 0)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Cancellation Rate */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Cancellation Rate</h4>
                            <Calendar className="w-5 h-5 text-red-600" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-end space-x-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {((orderStats.cancelled / orderStats.total) * 100 || 0).toFixed(1)}%
                                </span>
                                <div className="flex items-center text-sm text-green-600 mb-1">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    <span>-2.1%</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600">
                                {orderStats.cancelled} of {orderStats.total} orders cancelled
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{
                                        width: `${((orderStats.cancelled / orderStats.total) * 100 || 0)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Growth */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Revenue Growth</h4>
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-end space-x-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {calculatePercentageChange(orderStats.totalRevenue, previousPeriod.totalRevenue)}%
                                </span>
                                <div className="flex items-center text-sm text-blue-600 mb-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    <span>Growth</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600">
                                vs previous period
                            </p>

                            <div className="text-sm text-gray-600">
                                Current: {formatCurrency(orderStats.totalRevenue)}<br />
                                Previous: {formatCurrency(previousPeriod.totalRevenue)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Insights */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Insights</h3>
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {orderStats.processing + orderStats.shipped}
                            </div>
                            <div className="text-sm text-blue-700">Orders in Transit</div>
                        </div>

                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {formatCurrency(Math.round(orderStats.totalRevenue / 30))}
                            </div>
                            <div className="text-sm text-green-700">Daily Average Revenue</div>
                        </div>

                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {(orderStats.total / 30).toFixed(1)}
                            </div>
                            <div className="text-sm text-purple-700">Daily Average Orders</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderAnalytics; 