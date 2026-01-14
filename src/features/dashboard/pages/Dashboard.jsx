import {
    Package,
    ShoppingCart,
    DollarSign,
    Users,
    Star,
    ArrowUpRight,
    Plus,
    Eye,
    CreditCard
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { LoadingSpinner, PageLoader } from '../../../shared/components/Loader';
import { showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../shared/utils/storageManager';
// Import the new API functions
import {
    getVendorStats,
    getTopWeeklyProducts,
    getRecentWeeklyOrders,
    getTopWeeklyTransactions,
    getUserProfile,
    validateSellerAddress,
} from '../api/dashboardApi'; // Adjust path if needed

// --- Helper Functions ---

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
        case 'fulfilled':
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'unpaid':
        case 'unfulfilled':
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'shipped':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const Dashboard = () => {
    const { user: authUser } = useAuth();

    // --- Stats State Management ---
    const [stats, setStats] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topTransactions, setTopTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState({
        stats: true,
        products: true,
        orders: true,
        transactions: true,
    });
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // --- User Profile State Management ---
    const [userProfile, setUserProfile] = useState(() => storageManager.getUserData());

    // --- Data Fetching ---
    useEffect(() => {
        // 1. Existing Auth Check
        if (!authUser && !userProfile.user_id) {
            return;
        }

        // 2. Existing ID extraction
        const userId = authUser.user_id || userProfile.user_id || userProfile.data.id;

        const fetchDashboardData = async () => {
            try {
                // 3. YOUR EXISTING DATA FETCHING (Unchanged)
                const [statsData, productsData, ordersData, transactionsData, profileData] = await Promise.all([
                    getVendorStats().catch(err => {
                        console.error('Error fetching vendor stats:', err);
                        showError('Failed to load dashboard stats.');
                        setIsLoading(prev => ({ ...prev, stats: false }));
                        return null;
                    }),
                    getTopWeeklyProducts().catch(err => {
                        console.error('Error fetching top products:', err);
                        showError('Failed to load top products.');
                        setIsLoading(prev => ({ ...prev, products: false }));
                        return [];
                    }),
                    getRecentWeeklyOrders().catch(err => {
                        console.error('Error fetching recent orders:', err);
                        showError('Failed to load recent orders.');
                        setIsLoading(prev => ({ ...prev, orders: false }));
                        return [];
                    }),
                    getTopWeeklyTransactions().catch(err => {
                        console.error('Error fetching top transactions:', err);
                        showError('Failed to load top transactions.');
                        setIsLoading(prev => ({ ...prev, transactions: false }));
                        return [];
                    }),
                    getUserProfile(userId).catch(err => {
                        console.error('Error fetching user profile:', err);
                        showError('Could not refresh user profile.');
                        return null;
                    }),
                ]);

                // 4. YOUR EXISTING STATE UPDATES (Unchanged)
                if (statsData) setStats(statsData);
                if (productsData) setTopProducts(productsData);
                if (ordersData) setRecentOrders(ordersData);
                if (transactionsData) setTopTransactions(transactionsData);

                if (profileData) {
                    storageManager.setUserData(profileData);
                    setUserProfile(profileData);
                }

                // 5. --- NEW: BACKGROUND ADDRESS VALIDATION ---
                // This runs after the main data is fetched, but we don't 'await' it 
                // so it doesn't block the UI if it's slow.
                if (userId) {
                    const sellerId = userProfile.data.seller.id;
                    const validationKey = `addr_val_${sellerId}`;
                    const hasValidated = localStorage.getItem(validationKey);

                    if (!hasValidated) {
                        validateSellerAddress(sellerId)
                            .then(() => {
                                // On success, mark as done in local storage
                                localStorage.setItem(validationKey, 'true');
                                console.log("Address validation synced successfully");
                            })
                            .catch(err => {
                                // Silent fail - doesn't disturb the user
                                console.error("Address validation deferred:", err);
                            });
                    }
                }
                // ---------------------------------------------

            } catch (error) {
                console.error("An unexpected error occurred:", error);
                showError("An unexpected error occurred while loading the dashboard.");
            } finally {
                // 6. Existing Cleanup
                setIsLoading({ stats: false, products: false, orders: false, transactions: false });
                setIsInitialLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsCards = [
        { title: 'Total Revenue', value: stats ? formatCurrency(stats.total_revenue) : '...', icon: DollarSign, color: 'bg-green-500' },
        { title: 'Total Products', value: stats ? stats.total_products : '...', icon: Package, color: 'bg-brand-500' },
        { title: 'Total Orders', value: stats ? stats.total_orders : '...', icon: ShoppingCart, color: 'bg-blue-500' },
        { title: 'Total Reviews', value: stats ? stats.total_reviews : '...', icon: Users, color: 'bg-purple-500' },
    ];

    if (isInitialLoading) {
        return <PageLoader message="Loading your dashboard..." />;
    }

    const displayName = userProfile?.data?.first_name || authUser?.name || 'User';
    const storeName = userProfile?.data?.seller?.store_name;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back, {displayName}!
                        {storeName && ` Managing ${storeName}.`}
                        {!storeName && " Here's what's happening with your agricultural business."}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <div className={`p-3 rounded-lg w-fit ml-auto ${stat.color}`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Weekly Orders */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Weekly Orders</h2>
                            <button onClick={() => window.location.hash = '/orders'} className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6">
                            {isLoading.orders ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner size="md" message="Loading recent orders..." />
                                </div>
                            ) : recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center gap-4">
                                                <img src={order.products[0]?.thumbnail || 'https://via.placeholder.com/40'} alt={order.products[0]?.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.order_number}</p>
                                                    <p className="text-sm text-gray-600">by {order.user.first_name} {order.user.last_name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                                                <div className="flex items-center justify-end gap-2 mt-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.payment_status)}`}>{order.payment_status}</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.fulfillment_status)}`}>{order.fulfillment_status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No recent orders this week.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Top Products This Week */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Top Products This Week</h2>
                        </div>
                        <div className="p-6">
                            {isLoading.products ? (
                                <div className="flex items-center justify-center py-8">
                                    <LoadingSpinner size="md" message="Loading top products..." />
                                </div>
                            ) : topProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {topProducts.map((item) => (
                                        <div key={item.product_id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={item.product.thumbnail || 'https://via.placeholder.com/40'} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                                                <div>
                                                    <p className="font-medium text-gray-900 truncate max-w-[150px]">{item.product.name}</p>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-sm text-gray-600">Top Seller</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">{item.total_sold} sales</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No top products found this week.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Weekly Transactions */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Top Weekly Transactions</h2>
                    </div>
                    <div className="p-6">
                        {isLoading.transactions ? (
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner size="md" message="Loading transactions..." />
                            </div>
                        ) : topTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {topTransactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <CreditCard className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{tx.order_number}</p>
                                                <p className="text-sm text-gray-600">by {tx.user.first_name} {tx.user.last_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">{formatCurrency(tx.total_amount)}</p>
                                            <p className="text-sm text-gray-500">{formatDate(tx.created_at)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">No transactions found this week.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions (Unchanged) */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => window.location.href = '/products/add'} className="cursor-pointer flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-brand-100 rounded-lg"><Plus className="w-5 h-5 text-brand-600" /></div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">Add Product</p>
                                <p className="text-sm text-gray-600">List a new agricultural product</p>
                            </div>
                        </button>
                        <button onClick={() => window.location.href = '/products'} className="cursor-pointer flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-blue-100 rounded-lg"><Eye className="w-5 h-5 text-blue-600" /></div>
                            <div className="text-left">
                                <p className="font-medium text-gray-900">View Products</p>
                                <p className="text-sm text-gray-600">Manage your product listings</p>
                            </div>
                        </button>
                        <button onClick={() => window.location.href = '/orders'} className="cursor-pointer flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="p-2 bg-green-100 rounded-lg"><ShoppingCart className="w-5 h-5 text-green-600" /></div>
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