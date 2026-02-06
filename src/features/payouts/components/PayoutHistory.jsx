import { Hash, Calendar, Package, Percent } from 'lucide-react';

const PayoutHistory = ({ history = [] }) => {
    // Fail-safe to prevent inconsistent data from crashing app
    const safeHistory = Array.isArray(history) ? history : [];

    const statusConfig = {
        paid: { color: 'text-green-800 bg-green-100', label: 'Paid' },
        pending: { color: 'text-yellow-800 bg-yellow-100', label: 'Pending' },
        failed: { color: 'text-red-800 bg-red-100', label: 'Failed' },
        cancelled: { color: 'text-gray-800 bg-gray-100', label: 'Cancelled' }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-full">
            <div className="p-2 border-b border-gray-200 flex items-center justify-between md:p-6">
                <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Earning History</h3>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Details</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Value</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Commission</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Earnings</th>
                            <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {safeHistory.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    No transaction history found
                                </td>
                            </tr>
                        ) : (
                            safeHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    {/* Date */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {formatDate(item.date)}
                                        </div>
                                    </td>

                                    {/* Order Details */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">{item.order_number || 'N/A'}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <Package className="w-3 h-3" />
                                                <span className="truncate max-w-[150px]">{item.product_name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Product Total */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        ₦{parseInt(item.product_total).toLocaleString() || 'N/A'}
                                    </td>

                                    {/* Commission */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-600">₦{parseInt(item.commission_amount).toLocaleString() || 'N/A'}</span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Percent className="w-3 h-3" />
                                                {item.commission_rate || 'N/A'}% rate
                                            </div>
                                        </div>
                                    </td>

                                    {/* Earnings */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className="text-sm font-bold text-green-600">
                                            +₦{parseInt(item.your_earnings).toLocaleString() || 'N/A'}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${statusConfig[item.payout_status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {statusConfig[item.payout_status]?.label || item.payout_status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayoutHistory;