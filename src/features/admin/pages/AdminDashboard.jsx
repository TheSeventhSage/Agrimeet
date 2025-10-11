import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Users,
    Package,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    ArrowUpRight,
    FileCheck,
    MessageSquare,
    XCircle
} from 'lucide-react';
import { storageManager } from '../../../pages/utils/storageManager';
import { getUserProfile } from '../../../pages/api/profile.api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get user data from storage to get the userId
            const userData = storageManager.getUserData();

            if (!userData || !userData.id) {
                throw new Error('No user data found. Please log in again.');
            }

            setStats({
                        totalUsers: userData.total_users || 0,
                        userGrowth: userData.user_growth || '+0%',
                        activeProducts: userData.active_products || 0,
                        productGrowth: userData.product_growth || '+0%',
                        totalRevenue: userData.total_revenue || 0,
                        revenueGrowth: userData.revenue_growth || '+0%',
                        totalOrders: userData.total_orders || 0,
                        orderGrowth: userData.order_growth || '+0%',
                        pendingKyc: userData.pending_kyc || 0,
                        pendingProducts: userData.pending_products || 0,
                        openDisputes: userData.open_disputes || 0,
                        activeToday: userData.active_today || 0,
                        avgOrderValue: userData.avg_order_value || 0,
                        conversionRate: userData.conversion_rate || 0,
                        activeSellers: userData.active_sellers || 0,
                        completionRate: userData.completion_rate || 0
                    });
    
                    // Set recent activities if available
                    if (userData.recent_activities) {
                        setRecentActivities(userData.recent_activities);
                    }

            // Fetch profile data
            // const response = await getUserProfile(userData.id);

            // // Store profile data in storage manager
            // if (response?.data) {
            //     storageManager.setUserData(response.data);
            //     setProfileData(response.data);

            //     // Map profile data to stats
            //     // Adjust these mappings based on your actual API response structure
            //     setStats({
            //         totalUsers: response.data.total_users || 0,
            //         userGrowth: response.data.user_growth || '+0%',
            //         activeProducts: response.data.active_products || 0,
            //         productGrowth: response.data.product_growth || '+0%',
            //         totalRevenue: response.data.total_revenue || 0,
            //         revenueGrowth: response.data.revenue_growth || '+0%',
            //         totalOrders: response.data.total_orders || 0,
            //         orderGrowth: response.data.order_growth || '+0%',
            //         pendingKyc: response.data.pending_kyc || 0,
            //         pendingProducts: response.data.pending_products || 0,
            //         openDisputes: response.data.open_disputes || 0,
            //         activeToday: response.data.active_today || 0,
            //         avgOrderValue: response.data.avg_order_value || 0,
            //         conversionRate: response.data.conversion_rate || 0,
            //         activeSellers: response.data.active_sellers || 0,
            //         completionRate: response.data.completion_rate || 0
            //     });

            //     // Set recent activities if available
            //     if (response.data.recent_activities) {
            //         setRecentActivities(response.data.recent_activities);
            //     }
            // }
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');

            // If token expired or invalid, clear storage and redirect
            if (err.message.includes('401') || err.message.includes('unauthorized')) {
                storageManager.clearAll();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const mainStats = [
        {
            title: 'Total Users',
            value: (stats.totalUsers || 0).toLocaleString(),
            change: stats.userGrowth || '+0%',
            changeType: 'positive',
            icon: Users,
            color: 'bg-blue-500',
            link: '/admin/users'
        },
        {
            title: 'Active Products',
            value: (stats.activeProducts || 0).toLocaleString(),
            change: stats.productGrowth || '+0%',
            changeType: 'positive',
            icon: Package,
            color: 'bg-green-500',
            link: '/admin/products'
        },
        {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            change: stats.revenueGrowth || '+0%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'bg-purple-500',
            link: '/admin/transactions'
        },
        {
            title: 'Total Orders',
            value: (stats.totalOrders || 0).toLocaleString(),
            change: stats.orderGrowth || '+0%',
            changeType: 'positive',
            icon: ShoppingCart,
            color: 'bg-orange-500',
            link: '/admin/transactions'
        }
    ];

    const actionCards = [
        {
            title: 'Pending KYC',
            value: stats.pendingKyc || 0,
            description: 'Sellers awaiting verification',
            icon: FileCheck,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            link: '/admin/seller-approval',
            action: 'Review Now'
        },
        {
            title: 'Pending Products',
            value: stats.pendingProducts || 0,
            description: 'Products awaiting moderation',
            icon: Package,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            link: '/admin/products',
            action: 'Moderate'
        },
        {
            title: 'Open Disputes',
            value: stats.openDisputes || 0,
            description: 'Disputes requiring attention',
            icon: AlertCircle,
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50',
            link: '/admin/disputes',
            action: 'Resolve'
        },
        {
            title: 'Active Users Today',
            value: stats.activeToday || 0,
            description: 'Users online today',
            icon: Users,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            link: '/admin/users',
            action: 'View All'
        }
    ];

    const quickStats = [
        {
            label: 'Avg Order Value',
            value: `$${(stats.avgOrderValue || 0).toFixed(2)}`,
            icon: DollarSign
        },
        {
            label: 'Conversion Rate',
            value: `${(stats.conversionRate || 0).toFixed(1)}%`,
            icon: TrendingUp
        },
        {
            label: 'Active Sellers',
            value: stats.activeSellers || 0,
            icon: Users
        },
        {
            label: 'Completed Orders',
            value: `${(stats.completionRate || 0).toFixed(1)}%`,
            icon: CheckCircle
        }
    ];

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

    // Error state
    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
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

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back{profileData?.name ? `, ${profileData.name}` : ''}! Here's your platform overview
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainStats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {isLoading ? (
                                            <span className="inline-block h-8 w-20 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {isLoading ? (
                                            <span className="inline-block h-4 w-16 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            <>
                                                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stat.change}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = stat.link}
                                className="mt-4 text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                disabled={isLoading}
                            >
                                View Details
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {actionCards.map((card, index) => (
                        <div key={index} className={`${card.bgColor} rounded-xl p-6 hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-white`}>
                                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                                </div>
                                <span className="text-3xl font-bold text-gray-900">
                                    {isLoading ? (
                                        <span className="inline-block h-9 w-12 bg-white/50 animate-pulse rounded"></span>
                                    ) : (
                                        card.value
                                    )}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                            <button
                                onClick={() => window.location.href = card.link}
                                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                disabled={isLoading}
                            >
                                {card.action}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="p-3 bg-gray-100 rounded-lg">
                                    <stat.icon className="w-6 h-6 text-gray-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {isLoading ? (
                                            <span className="inline-block h-8 w-16 bg-gray-200 animate-pulse rounded"></span>
                                        ) : (
                                            stat.value
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                            <button className="text-brand-600 hover:text-brand-700 text-sm font-medium">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                </div>
                            ) : recentActivities.length > 0 ? (
                                recentActivities.slice(0, 6).map((activity, index) => {
                                    const Icon = getActivityIcon(activity.type);
                                    return (
                                        <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{activity.title || 'Activity'}</p>
                                                <p className="text-sm text-gray-600">{activity.description || 'No description'}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {activity.time || new Date(activity.created_at || Date.now()).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8">
                                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No recent activities</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Platform Health */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Health</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Server Status</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">98% Uptime</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">API Response</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Average: 120ms</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Database</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Optimal Performance</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Payment Gateway</span>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">All Systems Operational</p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Last Updated</span>
                                    <span className="font-medium text-gray-900">{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => window.location.href = '/admin/users'}
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
                            onClick={() => window.location.href = '/admin/products'}
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
                            onClick={() => window.location.href = '/admin/reports'}
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