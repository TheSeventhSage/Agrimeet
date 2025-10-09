import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    BarChart3,
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ShoppingCart,
    Download,
    Calendar,
    ArrowUp,
    ArrowDown,
    Activity,
    PieChart,
    LineChart
} from 'lucide-react';
import adminService from '../api/adminService';
import { showSuccess, showError } from '../../../shared/utils/alert';

const ReportsAnalytics = () => {
    const [metrics, setMetrics] = useState({});
    const [revenueData, setRevenueData] = useState({});
    const [userGrowthData, setUserGrowthData] = useState({});
    const [productData, setProductData] = useState({});
    const [orderData, setOrderData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('30days');
    const [selectedReport, setSelectedReport] = useState('overview');

    useEffect(() => {
        loadAnalytics();
    }, [selectedPeriod]);

    const loadAnalytics = async () => {
        try {
            setIsLoading(true);
            const [metricsRes, revenueRes, userRes, productRes, orderRes] = await Promise.all([
                adminService.getPlatformMetrics(),
                adminService.getRevenueAnalytics(selectedPeriod),
                adminService.getUserGrowthAnalytics(selectedPeriod),
                adminService.getProductAnalytics(selectedPeriod),
                adminService.getOrderAnalytics(selectedPeriod)
            ]);

            setMetrics(metricsRes.data);
            setRevenueData(revenueRes.data);
            setUserGrowthData(userRes.data);
            setProductData(productRes.data);
            setOrderData(orderRes.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            showError('Failed to load analytics');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportReport = async (reportType) => {
        try {
            await adminService.exportReport(reportType, { period: selectedPeriod });
            showSuccess('Report exported successfully');
        } catch (error) {
            showError('Failed to export report');
        }
    };

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${(metrics.totalRevenue || 0).toLocaleString()}`,
            change: metrics.revenueGrowth || '+0%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Total Users',
            value: (metrics.totalUsers || 0).toLocaleString(),
            change: metrics.userGrowth || '+0%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Orders',
            value: (metrics.totalOrders || 0).toLocaleString(),
            change: metrics.orderGrowth || '+0%',
            changeType: 'positive',
            icon: ShoppingCart,
            color: 'bg-purple-500'
        },
        {
            title: 'Active Products',
            value: (metrics.activeProducts || 0).toLocaleString(),
            change: metrics.productGrowth || '+0%',
            changeType: 'positive',
            icon: Package,
            color: 'bg-orange-500'
        }
    ];

    const topMetrics = [
        {
            label: 'Average Order Value',
            value: `$${(metrics.avgOrderValue || 0).toFixed(2)}`,
            icon: DollarSign,
            trend: metrics.aovTrend || '+5.2%',
            trendType: 'up'
        },
        {
            label: 'Conversion Rate',
            value: `${(metrics.conversionRate || 0).toFixed(1)}%`,
            icon: TrendingUp,
            trend: metrics.conversionTrend || '+2.1%',
            trendType: 'up'
        },
        {
            label: 'Active Sellers',
            value: (metrics.activeSellers || 0).toLocaleString(),
            icon: Users,
            trend: metrics.sellerTrend || '+12',
            trendType: 'up'
        },
        {
            label: 'Customer Satisfaction',
            value: `${(metrics.satisfaction || 0).toFixed(1)}%`,
            icon: Activity,
            trend: metrics.satisfactionTrend || '+1.5%',
            trendType: 'up'
        }
    ];

    const topProducts = productData.topProducts || [];
    const topSellers = metrics.topSellers || [];
    const topCategories = productData.topCategories || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                        <p className="text-gray-600 mt-2">Platform insights and performance metrics</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                            <option value="year">This Year</option>
                        </select>
                        <button
                            onClick={() => handleExportReport('overview')}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Key Performance Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topMetrics.map((metric, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <metric.icon className="w-6 h-6 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{metric.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {metric.trendType === 'up' ? (
                                            <ArrowUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className={`text-sm ${metric.trendType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                            {metric.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
                        <LineChart className="w-5 h-5 text-gray-400" />
                    </div>
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Revenue chart visualization</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Total: ${(revenueData.total || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                            <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {topProducts.length > 0 ? (
                                topProducts.slice(0, 5).map((product, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                                                <span className="text-sm font-bold text-brand-700">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-sm text-gray-600">{product.sales || 0} sales</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${(product.revenue || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 py-8">No data available</p>
                            )}
                        </div>
                    </div>

                    {/* Top Sellers */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Top Sellers</h2>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {topSellers.length > 0 ? (
                                topSellers.slice(0, 5).map((seller, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-bold text-blue-700">
                                                    {seller.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{seller.name}</p>
                                                <p className="text-sm text-gray-600">{seller.totalSales || 0} sales</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${(seller.revenue || 0).toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">{seller.products || 0} products</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-600 py-8">No data available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Growth & Order Statistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">User Growth</h2>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">New Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{userGrowthData.newUsers || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Growth</p>
                                    <p className="text-lg font-semibold text-green-600">{userGrowthData.growth || '+0%'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600">Active Users</p>
                                    <p className="text-xl font-bold text-gray-900">{userGrowthData.activeUsers || 0}</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-600">Retention Rate</p>
                                    <p className="text-xl font-bold text-gray-900">{userGrowthData.retentionRate || 0}%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Statistics */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Order Statistics</h2>
                            <ShoppingCart className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{orderData.totalOrders || 0}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Completed</p>
                                    <p className="text-lg font-semibold text-green-600">{orderData.completedRate || 0}%</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 border border-gray-200 rounded-lg text-center">
                                    <p className="text-xs text-gray-600">Pending</p>
                                    <p className="text-lg font-bold text-yellow-600">{orderData.pending || 0}</p>
                                </div>
                                <div className="p-3 border border-gray-200 rounded-lg text-center">
                                    <p className="text-xs text-gray-600">Shipped</p>
                                    <p className="text-lg font-bold text-blue-600">{orderData.shipped || 0}</p>
                                </div>
                                <div className="p-3 border border-gray-200 rounded-lg text-center">
                                    <p className="text-xs text-gray-600">Cancelled</p>
                                    <p className="text-lg font-bold text-red-600">{orderData.cancelled || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Category Performance</h2>
                        <PieChart className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {topCategories.length > 0 ? (
                            topCategories.map((category, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-brand-500 transition-colors">
                                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{category.products || 0}</p>
                                    <p className="text-sm text-gray-600 mt-1">{category.sales || 0} sales</p>
                                    <p className="text-sm font-semibold text-brand-600 mt-1">
                                        ${(category.revenue || 0).toLocaleString()}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-5 text-center text-gray-600 py-8">No category data available</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportsAnalytics;