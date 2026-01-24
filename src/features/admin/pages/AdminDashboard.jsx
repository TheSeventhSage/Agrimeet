import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Users,
    Package,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    FileCheck,
    MessageSquare,
    Loader2,
    Tag
} from 'lucide-react';
// Importadmin.api.js file
import { adminApi, getErrorMessage } from '../api/admin.api';

const AdminDashboard = () => {
    // State management
    const [platformStats, setPlatformStats] = useState({});
    const [consolidatedStats, setConsolidatedStats] = useState({});
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [weeklyRevenue, setWeeklyRevenue] = useState([]);
    const [weeklyTotals, setWeeklyTotals] = useState({});
    const [topTransactions, setTopTransactions] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [ordersByState, setOrdersByState] = useState([]);

    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load all dashboard data on mount
    useEffect(() => {
        loadDashboardData();
    }, []);

    /**
     * Fetch all dashboard data concurrently
     * Uses Promise.allSettled to handle independent failures gracefully
     */
    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch all data in parallel
            const results = await Promise.allSettled([
                adminApi.getPlatformStats(),
                adminApi.getConsolidatedStats(),
                adminApi.getRecentWeeklyOrders(),
                adminApi.getTopWeeklyProducts(),
                adminApi.getWeeklyRevenue(),
                adminApi.getWeeklyTotalRevenue(),
                adminApi.getWeeklyTransactions(),
                adminApi.getWeeklyProductsSold(),
                adminApi.getTopWeeklyTransactions(),
                adminApi.getWeeklyOutOfStock(),
                adminApi.getWeeklyOrdersByState(),
                adminApi.getMonthlyRevenue({ filter: 'month', months: 6 }),
                adminApi.getTopCategories({ last_days: 30 }),
                adminApi.getSoldProducts({ last_days: 30 })
            ]);

            // Extract data from settled promises
            const [
                platformStatsRes,
                consolidatedStatsRes,
                recentOrdersRes,
                topProductsRes,
                weeklyRevenueRes,
                weeklyTotalRevenueRes,
                weeklyTransactionsRes,
                weeklyProductsSoldRes,
                topTransactionsRes,
                outOfStockRes,
                ordersByStateRes,
                monthlyRevenueRes,
                topCategoriesRes,
                soldProductsRes
            ] = results;

            // Set platform stats
            if (platformStatsRes.status === 'fulfilled') {
                setPlatformStats(platformStatsRes.value || {});
            }

            // Set consolidated stats
            if (consolidatedStatsRes.status === 'fulfilled') {
                setConsolidatedStats(consolidatedStatsRes.value || {});
            }

            // Set recent orders
            if (recentOrdersRes.status === 'fulfilled') {
                setRecentOrders(Array.isArray(recentOrdersRes.value) ? recentOrdersRes.value : []);
            }

            // Set top products
            if (topProductsRes.status === 'fulfilled') {
                setTopProducts(Array.isArray(topProductsRes.value) ? topProductsRes.value : []);
            }

            // Set weekly revenue data
            if (weeklyRevenueRes.status === 'fulfilled') {
                setWeeklyRevenue(Array.isArray(weeklyRevenueRes.value) ? weeklyRevenueRes.value : []);
            }

            // Combine weekly totals
            const totals = {};
            if (weeklyTotalRevenueRes.status === 'fulfilled') {
                totals.total_revenue = weeklyTotalRevenueRes.value.total_revenue || 0;
            }
            if (weeklyTransactionsRes.status === 'fulfilled') {
                totals.total_transactions = weeklyTransactionsRes.value.total_transactions || 0;
            }
            if (weeklyProductsSoldRes.status === 'fulfilled') {
                totals.total_products_sold = weeklyProductsSoldRes.value.total_products_sold || 0;
            }
            setWeeklyTotals(totals);

            // Set top transactions
            if (topTransactionsRes.status === 'fulfilled') {
                setTopTransactions(Array.isArray(topTransactionsRes.value) ? topTransactionsRes.value : []);
            }

            // Set out of stock products
            if (outOfStockRes.status === 'fulfilled') {
                setOutOfStockProducts(Array.isArray(outOfStockRes.value) ? outOfStockRes.value : []);
            }

            // Set orders by state
            if (ordersByStateRes.status === 'fulfilled') {
                setOrdersByState(Array.isArray(ordersByStateRes.value) ? ordersByStateRes.value : []);
            }

            // Set monthly revenue
            if (monthlyRevenueRes.status === 'fulfilled') {
                setMonthlyRevenue(Array.isArray(monthlyRevenueRes.value) ? monthlyRevenueRes.value : []);
            }

            // Set top categories
            if (topCategoriesRes.status === 'fulfilled') {
                setTopCategories(Array.isArray(topCategoriesRes.value) ? topCategoriesRes.value : []);
            }

            // Set sold products
            if (soldProductsRes.status === 'fulfilled') {
                setSoldProducts(Array.isArray(soldProductsRes.value) ? soldProductsRes.value : []);
            }

            // Check if all critical requests failed
            const allFailed = results.every(result => result.status === 'rejected');
            if (allFailed) {
                throw new Error('Failed to load dashboard data');
            }

        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Calculate derived metrics from API data
     */
    const getDerivedMetrics = () => {
        const totalRevenue = platformStats.total_revenue || 0;
        const totalOrders = platformStats.total_orders || 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            avgOrderValue,
            totalRevenue,
            totalOrders,
            totalUsers: platformStats.total_users || 0,
            totalProducts: platformStats.total_products || 0,
            pendingOrders: consolidatedStats.pending_orders || 0,
            completedOrders: consolidatedStats.completed_orders || 0,
            activeSellers: consolidatedStats.active_sellers || 0,
            conversionRate: consolidatedStats.conversion_rate || 0
        };
    };

    const metrics = getDerivedMetrics();

    /**
     * Main dashboard stat cards configuration
     */
    const mainStats = [
        {
            title: 'Total Users',
            value: metrics.totalUsers.toLocaleString(),
            icon: Users,
            color: 'bg-blue-500',
            link: '/admin/users'
        },
        {
            title: 'Active Products',
            value: metrics.totalProducts.toLocaleString(),
            icon: Package,
            color: 'bg-green-500',
            link: '/admin/products'
        },
        {
            title: 'Total Revenue',
            value: `₦${Math.floor(Number(metrics.totalRevenue)).toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-purple-500',
            link: '/admin/transactions'
        },
        {
            title: 'Total Orders',
            value: metrics.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-orange-500',
            link: '/admin/transactions'
        }
    ];

    /**
     * Quick stats for the dashboard
     */
    const quickStats = [
        {
            label: 'Weekly Revenue',
            value: `₦${(Math.floor(Number(weeklyTotals.total_revenue)) || 0).toLocaleString()}`,
            icon: DollarSign
        },
        {
            label: 'Weekly Orders',
            value: (Number(weeklyTotals.total_transactions) || 0).toLocaleString(),
            icon: ShoppingCart
        },
        {
            label: 'Weekly Products Sold',
            value: (weeklyTotals.total_products_sold || 0).toLocaleString(),
            icon: Package
        },
        {
            label: 'Avg Order Value (All Time)',
            value: `₦${(Math.floor(Number(metrics.avgOrderValue)) || 0).toLocaleString()}`,
            icon: TrendingUp
        }
    ];

    /**
     * Get icon component for activity type
     */
    const getActivityIcon = (type) => {
        const icons = {
            user: Users,
            product: Package,
            order: ShoppingCart,
            dispute: MessageSquare,
            kyc: FileCheck,
            transaction: DollarSign
        };
        return icons[type] || AlertCircle;
    };

    /**
     * Get color classes for activity type
     */
    const getActivityColor = (type) => {
        const colors = {
            user: 'bg-blue-100 text-blue-600',
            product: 'bg-green-100 text-green-600',
            order: 'bg-purple-100 text-purple-600',
            dispute: 'bg-red-100 text-red-600',
            kyc: 'bg-yellow-100 text-yellow-600',
            transaction: 'bg-orange-100 text-orange-600'
        };
        return colors[type] || 'bg-gray-100 text-gray-600';
    };

    /**
     * Get month name from month number
     */
    const getMonthName = (month) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[month - 1] || '';
    };

    /**
     * Render loading skeleton
     */
    const LoadingSkeleton = () => (
        <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-brand-600 mx-auto mb-4 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
                <p className="text-gray-600">Please wait while we fetch your data...</p>
            </div>
        </div>
    );

    /**
     * Render error state
     */
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={loadDashboardData}
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    /**
     * Render loading state
     */
    if (isLoading) {
        return (
            <DashboardLayout>
                <LoadingSkeleton />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back! Here's your platform overview
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainStats.map((stat, index) => (
                        <div key={index} className="flex gap-2 flex-col bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className={`p-3 rounded-lg w-fit ml-auto ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-lg font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(stat.link)}
                                    className="mt-4 text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Statistics (This Week)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-start gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg text-end">
                                    <stat.icon className="w-6 h-6 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-lg  font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- NEW SECTION: Monthly Revenue Trend --- */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Revenue (Last 6 Months)</h2>
                    {monthlyRevenue.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {monthlyRevenue.map((item, index) => (
                                <div key={index} className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                                    <p className="text-sm font-medium text-purple-700">
                                        {getMonthName(item.month)} {item.year}
                                    </p>
                                    <p className="text-base font-bold text-purple-900 mt-2">
                                        ₦{(Math.floor(Number(item.total_amount)) || 0).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No monthly revenue data available</p>
                        </div>
                    )}
                </div>
                {/* --- END NEW SECTION --- */}

                {/* --- Top Categories & Best Sellers --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Categories */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Top Categories (Last 30 Days)</h2>
                            <Tag className="w-5 h-5 text-gray-400" />
                        </div>
                        {topCategories.length > 0 ? (
                            <div className="space-y-4">
                                {topCategories.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {category.category_name || 'Category'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    ID: {category.category_id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">
                                                ₦{(Math.floor(Number(category.total_amount)) || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No category data available</p>
                            </div>
                        )}
                    </div>

                    {/* Best Selling Products */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Best Sellers (Last 30 Days)</h2>
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                        </div>
                        {soldProducts.length > 0 ? (
                            <div className="space-y-4">
                                {soldProducts.map((product, index) => (
                                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        {product.product_photo && (
                                            <img
                                                src={product.product_photo}
                                                alt={product.product_name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.product_name || 'Product'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product.sales_count || 0} sales
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900">
                                                ₦{(Math.floor(Number(product.total_amount)) || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No product sales data available</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* --- END NEW SECTION --- */}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Weekly Orders */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Weekly Orders</h2>
                            <button
                                onClick={() => navigate('/admin/orders')}
                                className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.length > 0 ? (
                                recentOrders.slice(0, 6).map((order, index) => {
                                    const Icon = getActivityIcon('order');
                                    return (
                                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                                            <div className={`p-2 rounded-lg ${getActivityColor('order')}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Order #{order.order_number}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {order.user?.first_name} {order.user?.last_name} - ₦{(order.total_amount || 0).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(order.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${order.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.order_status || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No recent orders this week</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Weekly Products */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Weekly Products</h2>
                        {topProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Rank</th>
                                            <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">Sold</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {topProducts.slice(0, 10).map((product, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                    #{index + 1}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                    {product.product?.name || 'Product'}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                                                    {product.total_sold || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No product data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Transactions & Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Weekly Transactions */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Weekly Transactions</h2>
                        <div className="space-y-4">
                            {topTransactions.length > 0 ? (
                                topTransactions.slice(0, 5).map((order, index) => (
                                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className={`p-2 rounded-lg ${getActivityColor('transaction')}`}>
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order.order_number}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.user?.first_name} {order.user?.last_name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-gray-900">
                                                ₦{(Math.floor(Number(order.total_amount)) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No top transactions this week</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Weekly Out of Stock */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Low/Out of Stock Products</h2>
                        <div className="space-y-4">
                            {outOfStockProducts.length > 0 ? (
                                outOfStockProducts.slice(0, 5).map((product, index) => (
                                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                                        <div className={`p-2 rounded-lg ${getActivityColor('product')}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {product.name || 'Product'}
                                            </p>
                                            <p className="text-xs text-red-600 font-medium mt-1">
                                                Stock: {product.stock_quantity || 0} (Threshold: {product.low_stock_threshold || 0})
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/admin/products`)}
                                            className="text-brand-600 hover:text-brand-700 text-sm font-medium"
                                        >
                                            View
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                    <p className="text-gray-600">All products are in stock</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Orders by State */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Orders by State</h2>
                    {ordersByState.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {ordersByState.map((state, index) => (
                                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {state.address_state || 'Unknown'}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">
                                        {state.total_orders}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No regional order data this week</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Manage Users</p>
                                <p className="text-sm text-gray-600">View and manage user accounts</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/products')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Moderate Products</p>
                                <p className="text-sm text-gray-600">Review product listings</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/reports')}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">View Reports</p>
                                <p className="text-sm text-gray-600">Check analytics and insights</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;