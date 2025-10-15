import { useState, useEffect, useMemo } from 'react';
import {
    DollarSign, Users, Package, Star, Calendar, Download, AlertCircle, RefreshCw
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { PageLoader, LoadingSpinner } from '../../../shared/components/Loader';
import { showError } from '../../../shared/utils/alert';
import {
    getVendorAllStats,
    getWeeklyRevenue,
    getTopCategories,
    getPopularProducts,
    getWeeklyOutOfStockProducts
} from '../api/analyticsApi';

// --- Helper Components ---
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ChartContainer = ({ title, children, isLoading }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-72">{isLoading ? <div className="flex items-center justify-center h-full"><LoadingSpinner message={`Loading ${title}...`} /></div> : children}</div>
    </div>
);
const DataErrorState = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-red-600 bg-red-50 rounded-lg p-4">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p className="font-semibold">Could not load data</p>
        <p className="text-sm">{message}</p>
    </div>
);


// --- Main Analytics Component ---
const Analytics = () => {
    console.log("Analytics component rendered.");

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoading, setIsLoading] = useState({ stats: true, charts: true, products: true });
    const [loadingErrors, setLoadingErrors] = useState({
        stats: null,
        weeklyRevenue: null,
        topCategories: null,
        popularProducts: null,
        lowStock: null,
    });
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const [allStats, setAllStats] = useState(null);
    const [weeklyRevenue, setWeeklyRevenue] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [activeDateRange, setActiveDateRange] = useState('30d');

    useEffect(() => {
        console.log("%cuseEffect triggered: Starting data fetch...", "color: blue; font-weight: bold;");

        const fetchAllAnalyticsData = async () => {
            setIsInitialLoading(true);
            const results = await Promise.allSettled([
                getVendorAllStats(),
                getWeeklyRevenue(),
                getTopCategories(),
                getPopularProducts(),
                getWeeklyOutOfStockProducts()
            ]);
            console.log("Promise.allSettled results:", results);
            const [statsRes, weeklyRevRes, categoriesRes, popularProdRes, lowStockRes] = results;

            if (statsRes.status === 'fulfilled') setAllStats(statsRes.value);
            else { setLoadingErrors(prev => ({ ...prev, stats: statsRes.reason.message })); showError('Failed to load KPI stats.'); }

            if (weeklyRevRes.status === 'fulfilled') setWeeklyRevenue(weeklyRevRes.value);
            else { setLoadingErrors(prev => ({ ...prev, weeklyRevenue: weeklyRevRes.reason.message })); showError('Failed to load weekly revenue.'); }

            if (categoriesRes.status === 'fulfilled') setTopCategories(categoriesRes.value);
            else { setLoadingErrors(prev => ({ ...prev, topCategories: categoriesRes.reason.message })); showError('Failed to load top categories.'); }

            if (popularProdRes.status === 'fulfilled') setPopularProducts(popularProdRes.value);
            else { setLoadingErrors(prev => ({ ...prev, popularProducts: popularProdRes.reason.message })); showError('Failed to load popular products.'); }

            if (lowStockRes.status === 'fulfilled') setLowStockProducts(lowStockRes.value);
            else { setLoadingErrors(prev => ({ ...prev, lowStock: lowStockRes.reason.message })); showError('Failed to load low stock products.'); }

            setLastUpdated(new Date());
            setIsInitialLoading(false);
            setIsLoading({ stats: false, charts: false, products: false });
            console.log("%cuseEffect finished: All data processed.", "color: green; font-weight: bold;");
        };
        fetchAllAnalyticsData();
    }, []);

    const kpiData = useMemo(() => {
        if (!allStats) return { totalRevenue: 0, totalCustomers: 0, productsSold: 0, topProduct: 'N/A' };
        const totalRevenue = allStats.revenue_by_month.reduce((acc, month) => acc + month.total, 0);
        const productsSold = allStats.top_products.reduce((acc, prod) => acc + prod.total_sold, 0);
        const topProduct = allStats.top_products.sort((a, b) => b.total_sold - a.total_sold)[0]?.product.name || 'N/A';
        return { totalRevenue, totalCustomers: allStats.total_customers, productsSold, topProduct };
    }, [allStats]);

    // ✅✅✅ THIS WAS THE MISSING CODE BLOCK ✅✅✅
    const kpiCards = [
        { title: 'Total Revenue', value: formatCurrency(kpiData.totalRevenue), icon: DollarSign, color: 'text-green-600' },
        { title: 'Total Customers', value: kpiData.totalCustomers, icon: Users, color: 'text-blue-600' },
        { title: 'Products Sold', value: kpiData.productsSold, icon: Package, color: 'text-brand-600' },
        { title: 'Top Performing Product', value: kpiData.topProduct, icon: Star, color: 'text-yellow-500', isText: true },
    ];

    const monthlyRevenueData = useMemo(() => allStats?.revenue_by_month.map(d => ({ name: monthNames[d.month - 1], Revenue: d.total })) || [], [allStats]);
    const weeklyRevenueChartData = useMemo(() => weeklyRevenue.map(d => ({ name: new Date(d.date).toLocaleString('en-US', { weekday: 'short' }), Revenue: d.total })) || [], [weeklyRevenue]);
    const categoryChartData = useMemo(() => topCategories.map(cat => ({ name: cat.category_name, value: cat.monthly_data.reduce((acc, month) => acc + month.total_amount, 0) })), [topCategories]);
    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (isInitialLoading) {
        return <PageLoader message="Loading analytics overview..." />;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
                        <p className="text-gray-600 mt-2">Gain insights into your store’s sales and product performance.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
                            {['7d', '30d', 'Custom'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setActiveDateRange(range)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeDateRange === range ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'}`}
                                >
                                    {range === 'Custom' ? <Calendar className="w-4 h-4 inline-block mr-1" /> : null} {range}
                                </button>
                            ))}
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                {loadingErrors.stats ? (
                    <DataErrorState message={loadingErrors.stats} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                        <p className={`mt-2 font-bold ${card.isText ? 'text-xl truncate' : 'text-3xl'}`}>
                                            {card.value}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-xs text-gray-500 text-center -mt-4">
                    Last updated: {lastUpdated.toLocaleString()}
                </p>

                {/* Charts Section and the rest of the component... */}
                {/* ... (no other changes needed) ... */}
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <ChartContainer title="Monthly Revenue" isLoading={isLoading.charts}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="Revenue" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                    <div className="lg:col-span-2">
                        <ChartContainer title="Weekly Revenue" isLoading={isLoading.charts}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyRevenueChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} hide />
                                    <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '0.5rem' }} />
                                    <Bar dataKey="Revenue" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>

                {/* Second Row of Charts/Data */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <ChartContainer title="Top Categories" isLoading={isLoading.charts}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={categoryChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                                        {categoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                    <div className="lg:col-span-2">
                        {/* Low Stock Table - UPDATED WITH ERROR HANDLING */}
                        <div className="bg-white h-full rounded-xl shadow-xs border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h3>
                            {isLoading.products ? (
                                <LoadingSpinner />
                            ) : loadingErrors.lowStock ? (
                                <DataErrorState message={loadingErrors.lowStock} />
                            ) : lowStockProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {lowStockProducts.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 text-yellow-500" />
                                                <p className="font-medium text-gray-800">{product.name}</p>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-bold text-red-600">{product.stock_quantity}</span>
                                                <span className="text-gray-500"> / {product.low_stock_threshold} threshold</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <Package className="w-12 h-12 mb-2" />
                                    <p>All products are well-stocked!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900">Top Products by Revenue</h2>
                    </div>
                    {isLoading.products ? <div className="p-6"><LoadingSpinner /></div> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratings</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {popularProducts.sort((a, b) => b.total_revenue - a.total_revenue).map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-lg object-cover" src={product.thumbnail} alt={product.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{formatCurrency(product.price)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{formatCurrency(product.total_revenue)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.total_orders}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.total_ratings}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;