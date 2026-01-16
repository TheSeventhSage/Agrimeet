import { Wallet, Clock, CreditCard, TrendingUp, Calendar, ArrowDownLeft } from 'lucide-react';

const WalletOverview = ({
    overviewData,
    trend,
    history,
    timeFilter,
    onTimeFilterChange,
    loading,
    error,
    onRetry
}) => {

    const balanceCards = [
        {
            title: 'Available Balance',
            value: overviewData.wallet_balance || 0, // Updated to consume wallet_balance
            color: 'green',
            icon: Wallet,
            description: 'Ready for withdrawal'
        },
        {
            title: 'Pending Balance',
            value: overviewData.pending_payouts || 0,
            color: 'yellow',
            icon: Clock,
            description: 'Processing payments'
        },
        {
            title: 'Total Earnings',
            value: overviewData.total_earnings || 0,
            color: 'blue',
            icon: CreditCard,
            description: 'Lifetime earnings'
        }
    ];

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-2">
                <span>{error}</span>
                <button onClick={onRetry} className="underline text-sm font-medium">Retry</button>
            </div>
        );
    }

    // Calculate max value for chart scaling
    // Updated to use 'total_earnings' from your API response and parse it as float
    const maxTrendValue = trend.length > 0 ? Math.max(...trend.map(t => parseFloat(t.total_earnings || 0)), 1) : 1000;

    // Take only the first 5 items for the "Recent History" view
    const recentHistory = history.slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Wallet Overview</h3>
                    <p className="text-gray-500 text-sm mt-1">Manage your earnings and payouts</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={timeFilter}
                        onChange={(e) => onTimeFilterChange(e.target.value)}
                        className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500"
                        disabled={loading}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {balanceCards.map((card) => {
                    const IconComponent = card.icon;
                    const colorStyles = {
                        green: 'bg-green-50 border-green-200 text-green-700 icon-bg-green-100',
                        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 icon-bg-yellow-100',
                        blue: 'bg-blue-50 border-blue-200 text-blue-700 icon-bg-blue-100'
                    };

                    return (
                        <div key={card.title} className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${colorStyles[card.color].split(' ')[0]} ${colorStyles[card.color].split(' ')[1]}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className={`text-sm font-medium opacity-80 ${colorStyles[card.color].split(' ')[2]}`}>
                                        {card.title}
                                    </p>
                                    <h4 className="text-2xl font-bold mt-2 text-gray-900">
                                        ₦{card.value.toLocaleString()}
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${card.color === 'green' ? 'bg-green-100 text-green-600' : card.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Earnings Chart */}
                {/* <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-brand-600" />
                            <h4 className="font-semibold text-gray-900">Monthly Earnings Trend</h4>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 mt-4">
                        {trend.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No trend data available
                            </div>
                        ) : (
                            trend.map((item, index) => {
                                // Updated to consume item.total_earnings
                                const earnings = parseFloat(item.total_earnings || 0);
                                const heightPercentage = (earnings / maxTrendValue) * 100;
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 group">
                                        <div className="relative w-full flex items-end justify-center h-full">
                                            <div
                                                className="w-full max-w-[40px] bg-brand-200 rounded-t-sm group-hover:bg-brand-500 transition-all duration-300 relative"
                                                style={{ height: `${heightPercentage}%` }}
                                            >
                                                <-- tooltip -->
                                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity z-10">
                                                    ₦{earnings.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 font-medium truncate w-full text-center">
                                            {item.month}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div> */}

                {/* Recent Transactions List */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h4 className="font-semibold text-gray-900">Recent History</h4>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {recentHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-8">
                                <Clock className="w-8 h-8 mb-2 opacity-50" />
                                <p className="text-sm">No recent transactions</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentHistory.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 rounded-full text-green-600">
                                                <ArrowDownLeft className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.product_name || item.order_number}</p>
                                                <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">+₦{parseFloat(item.your_earnings || 0).toLocaleString()}</p>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.payout_status === 'paid' ? 'bg-green-100 text-green-700' :
                                                item.payout_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.payout_status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletOverview;