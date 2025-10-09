import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    DollarSign,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    CreditCard,
    Calendar,
    User,
    Package,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import adminService from '../api/adminService';
import { showSuccess, showError } from '../../../shared/utils/alert';

const TransactionOversight = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        type: 'all',
        date_from: '',
        date_to: '',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total: 0
    });

    useEffect(() => {
        loadTransactions();
        loadStats();
    }, [filters]);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getTransactions(filters);
            setTransactions(response.data.data || response.data);
            setPagination(response.data.meta || response.data.pagination || {
                current_page: 1,
                total_pages: 1,
                total: response.data.length || 0
            });
        } catch (error) {
            console.error('Failed to load transactions:', error);
            showError('Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminService.getTransactionStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleViewTransaction = async (transaction) => {
        try {
            const response = await adminService.getTransactionById(transaction.id);
            setSelectedTransaction(response.data);
            setShowTransactionModal(true);
        } catch (error) {
            showError('Failed to load transaction details');
        }
    };

    const handleExportTransactions = async () => {
        try {
            await adminService.exportTransactions(filters);
            showSuccess('Transactions exported successfully');
        } catch (error) {
            showError('Failed to export transactions');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            failed: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
            processing: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Processing' },
            refunded: { color: 'bg-purple-100 text-purple-800', icon: TrendingUp, label: 'Refunded' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const typeColors = {
            payment: 'bg-blue-100 text-blue-800',
            refund: 'bg-purple-100 text-purple-800',
            payout: 'bg-green-100 text-green-800',
            withdrawal: 'bg-orange-100 text-orange-800'
        };
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || typeColors.payment}`}>
                {type?.charAt(0).toUpperCase() + type?.slice(1) || 'Payment'}
            </span>
        );
    };

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            change: stats.revenueGrowth || '+0%',
            icon: DollarSign,
            color: 'bg-green-500'
        },
        {
            title: 'Today\'s Transactions',
            value: stats.todayTransactions || 0,
            change: stats.todayGrowth || '+0%',
            icon: TrendingUp,
            color: 'bg-blue-500'
        },
        {
            title: 'Pending Payments',
            value: stats.pendingCount || 0,
            change: `$${(stats.pendingAmount || 0).toLocaleString()}`,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Failed Transactions',
            value: stats.failedCount || 0,
            change: stats.failedChange || '0',
            icon: XCircle,
            color: 'bg-red-500'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Transaction Oversight</h1>
                        <p className="text-gray-600 mt-2">Monitor all platform transactions and payment records</p>
                    </div>
                    <button
                        onClick={handleExportTransactions}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <p className="text-sm text-green-600 mt-2">{stat.change}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by transaction ID, user, or order..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Types</option>
                                <option value="payment">Payment</option>
                                <option value="refund">Refund</option>
                                <option value="payout">Payout</option>
                                <option value="withdrawal">Withdrawal</option>
                            </select>
                        </div>

                        {/* Date Range */}
                        <div>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                placeholder="From"
                            />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">No transactions found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                                                        <CreditCard className="w-5 h-5 text-brand-700" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {transaction.transaction_id || transaction.id}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {transaction.payment_method || 'Card Payment'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {transaction.user_name || transaction.buyer_name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {transaction.user_email || transaction.buyer_email || ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getTypeBadge(transaction.type || 'payment')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    ${transaction.amount?.toLocaleString() || 0}
                                                </div>
                                                {transaction.fee && (
                                                    <div className="text-xs text-gray-500">
                                                        Fee: ${transaction.fee}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(transaction.status || 'pending')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(transaction.created_at || Date.now()).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(transaction.created_at || Date.now()).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleViewTransaction(transaction)}
                                                    className="text-brand-600 hover:text-brand-900 p-2 hover:bg-brand-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && transactions.length > 0 && (
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{((pagination.current_page - 1) * 10) + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> of{' '}
                                <span className="font-medium">{pagination.total}</span> transactions
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={pagination.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-700">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </span>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={pagination.current_page === pagination.total_pages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Details Modal */}
            {showTransactionModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                                <button
                                    onClick={() => setShowTransactionModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Transaction Info */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                                        <p className="text-gray-900 font-mono">{selectedTransaction.transaction_id || selectedTransaction.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Type</label>
                                        <div className="mt-1">{getTypeBadge(selectedTransaction.type)}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Amount</label>
                                        <p className="text-gray-900 text-lg font-semibold">
                                            ${selectedTransaction.amount?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Payment Method</label>
                                        <p className="text-gray-900">{selectedTransaction.payment_method || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Date</label>
                                        <p className="text-gray-900">
                                            {new Date(selectedTransaction.created_at || Date.now()).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* User Info */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">User Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Name</label>
                                        <p className="text-gray-900">{selectedTransaction.user_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-gray-900">{selectedTransaction.user_email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info */}
                            {selectedTransaction.order_id && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Order ID</label>
                                            <p className="text-gray-900">{selectedTransaction.order_id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Order Number</label>
                                            <p className="text-gray-900">{selectedTransaction.order_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TransactionOversight;