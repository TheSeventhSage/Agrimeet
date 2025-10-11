import {
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Users,
    Star,
    Eye,
    Plus,
    ArrowUpRight
}
    from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import { getProducts } from '../../products/api/productsApi';
import { getUserProfile } from '../../../pages/api/profile.api';
import { useAuth } from '../../../pages/contexts/AuthContext';
import { LoadingSpinner, PageLoader } from '../../../shared/components/Loader';
import { showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../pages/utils/storageManager';

const Dashboard = () => {
    const { user: authUser } = useAuth();

    // State for products
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [previousTotalProducts, setPreviousTotalProducts] = useState(0);

    // State for user profile
    // const [userProfile, setUserProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Combined loading state
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Fetch user profile
    // Remove the useEffect for fetching user profile and replace it with this approach
    useEffect(() => {
        const fetchFreshUserData = async () => {
            if (!authUser?.id) {
                setIsLoadingProfile(false);
                return;
            }

            try {
                setIsLoadingProfile(true);
                const profileData = await getUserProfile(authUser.id);
                console.log('Fetched fresh user data:', profileData.data);

                if (profileData?.data) {
                    // Always set fresh data to storageManager
                    storageManager.setUserData(profileData.data);
                    console.log('Fetched fresh user data:', profileData.data);
                } else {
                    console.warn('No user data found in response');
                }
            } catch (error) {
                console.error('Error fetching fresh user data:', error);
                showError('Failed to load profile data');
            } finally {
                setIsLoadingProfile(false);
            }
        };

        // Fetch fresh data on every component mount (page reload)
        fetchFreshUserData();
    }, [authUser?.id]);

    // Also add this useEffect to handle page refresh detection
    useEffect(() => {
        // This will run on every component mount (including page reloads)
        console.log('Dashboard mounted - fetching fresh data');
    }, []);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoadingProducts(true);
                const response = await getProducts(1, { per_page: 6 });
                const productsData = response.data || [];
                const currentTotal = response.total || response.meta?.total || productsData.length;

                setProducts(productsData);
                setTotalProducts(currentTotal);
                setPreviousTotalProducts(currentTotal);
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setTotalProducts(0);
                setPreviousTotalProducts(0);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    // Update initial loading state
    useEffect(() => {
        if (!isLoadingProfile && !isLoadingProducts) {
            setIsInitialLoading(false);
        }
    }, [isLoadingProfile, isLoadingProducts]);

    const calculateGrowth = (current, previous) => {
        if (previous === 0) {
            return 0;
        }
        return ((current - previous) / previous) * 100;
    };

    const stats = [
        {
            title: 'Total Products',
            value: isLoadingProducts ? '...' : totalProducts.toString(),
            change: '0%',
            changeType: 'positive',
            icon: Package,
            color: 'bg-brand-500'
        },
        {
            title: 'Total Orders',
            value: '0',
            change: '0%',
            changeType: 'positive',
            icon: ShoppingCart,
            color: 'bg-blue-500'
        },
        {
            title: 'Revenue',
            value: '$0',
            change: '0%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Growth Rate',
            value: '0%',
            change: '0%',
            changeType: 'positive',
            icon: TrendingUp,
            color: 'bg-purple-500'
        }
    ];

    const topProducts = [
        {
            name: 'Fresh Maize',
            sales: 45,
            revenue: '$4,500',
            rating: 4.5
        },
        {
            name: 'Premium Rice',
            sales: 32,
            revenue: '$5,760',
            rating: 4.1
        },
        {
            name: 'Fresh Tomatoes',
            sales: 28,
            revenue: '$1,960',
            rating: 4.4
        },
        {
            name: 'Organic Yam',
            sales: 22,
            revenue: '$2,860',
            rating: 4.2
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Show full page loader during initial load
    if (isInitialLoading) {
        return <PageLoader message="Loading your dashboard..." />;
    }

    let userProfile = storageManager.getUserData();
    // Get display name
    const displayName = userProfile?.data?.first_name || authUser?.name || 'User';
    const storeName = userProfile?.data?.seller?.store_name;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {displayName}!
                        {storeName && ` Managing ${storeName}.`}
                        {!storeName && " Here's what's happening with your agricultural business."}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center mt-2">
                                        <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {stat.change}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Products */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
                                <button
                                    onClick={() => window.location.hash = '/products'}
                                    className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1"
                                >
                                    View all
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {isLoadingProducts ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner size="md" message="Loading products..." />
                                </div>
                            ) : products.length > 0 ? (
                                <div className="space-y-4">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {product.category?.name || 'Uncategorized'} •
                                                        Stock: {product.stock_quantity || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">${product.base_price}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : product.status === 'inactive'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No products found</p>
                                    <button
                                        onClick={() => window.location.hash = '/products/add'}
                                        className="mt-2 text-brand-600 hover:text-brand-700 text-sm font-medium"
                                    >
                                        Add your first product
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                                                <span className="text-sm font-bold text-brand-600">#{index + 1}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600">{product.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">{product.sales} sales</p>
                                            <p className="text-sm text-gray-600">{product.revenue}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => window.location.hash = '/products/add'}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-brand-100 rounded-lg">
                                <Plus className="w-5 h-5 text-brand-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Add Product</p>
                                <p className="text-sm text-gray-600">List a new agricultural product</p>
                            </div>
                        </button>

                        <button
                            onClick={() => window.location.hash = '/products'}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">View Products</p>
                                <p className="text-sm text-gray-600">Manage your product listings</p>
                            </div>
                        </button>

                        <button
                            onClick={() => window.location.hash = '/orders'}
                            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">View Orders</p>
                                <p className="text-sm text-gray-600">Check order status and details</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;