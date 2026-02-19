import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
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
    ChevronLeft,
    ChevronRight,
    X,
    User,
    Store
} from 'lucide-react';
import adminWithdrawalService from '../../commissionsManagement/api/adminWithdrawalService';
import { showSuccess, showError } from '../../../../shared/utils/alert';
import { Button, ConfirmationModal } from '../../../../shared/components';

const TransactionOversight = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => { }
    });

    // Filters state
    const [filters, setFilters] = useState({
        status: '', // pending, processing, completed, rejected
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });

    useEffect(() => {
        loadTransactions();
    }, [filters]);

    const loadTransactions = async () => {
        try {
            setIsLoading(true);

            const filter = {
                status: filters.status,
                page: filters.page
            }
            filter.status === '' && delete filter.status;

            const response = await adminWithdrawalService.getWithdrawals(filter);

            // Handle response structure based on the API definition provided
            const responseData = response.data?.data ? response.data : response;

            setTransactions(responseData.data || []);

            if (responseData.meta) {
                setPagination({
                    current_page: responseData.meta.current_page,
                    last_page: responseData.meta.last_page,
                    total: responseData.meta.total,
                    per_page: responseData.meta.per_page
                });
            }
        } catch (error) {
            console.error('Error loading withdrawals:', error);
            showError('Failed to load withdrawal requests');
        } finally {
            setIsLoading(false);
        }
    };

    // Action Handlers
    const handleApprove = (id) => {
        setConfirmation({
            isOpen: true,
            title: 'Approve Request',
            message: 'Are you sure you want to approve this withdrawal? Funds will be released to the seller immediately.',
            type: 'success',
            onConfirm: () => executeApprove(id)
        });
    };

    const handleReject = (id) => {
        setConfirmation({
            isOpen: true,
            title: 'Reject Request',
            message: 'Are you sure you want to reject this withdrawal? The funds will be reversed to the seller wallet.',
            type: 'danger',
            onConfirm: () => executeReject(id)
        });
    };

    const executeApprove = async (id) => {
        try {
            setIsProcessing(true);
            await adminWithdrawalService.approveWithdrawal(id);
            showSuccess('Withdrawal request approved successfully');
            setShowTransactionModal(false);
            loadTransactions();
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to approve withdrawal');
        } finally {
            setIsProcessing(false);
            setConfirmation(prev => ({ ...prev, isOpen: false }));
        }
    };

    const executeReject = async (id) => {
        try {
            setIsProcessing(true);
            await adminWithdrawalService.rejectWithdrawal(id);
            showSuccess('Withdrawal request rejected');
            setShowTransactionModal(false);
            loadTransactions();
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to reject withdrawal');
        } finally {
            setIsProcessing(false);
            setConfirmation(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Withdrawal Requests</h1>
                    <p className="text-gray-600">Manage and oversee seller payouts</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <button
                        onClick={() => setFilters({ status: '', page: 1 })}
                        className="text-sm text-gray-500 hover:text-brand-600 font-medium ml-auto"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Seller</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Gateway / Ref</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-medium text-sm">
                                                    {transaction.user?.first_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{transaction.user?.first_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{transaction.user?.seller?.store_name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900">
                                                ₦{parseFloat(transaction.amount).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 capitalize">{transaction.gateway || '-'}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]" title={transaction.reference}>
                                                {transaction.reference || '-'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setShowTransactionModal(true);
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
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
                        <span className="text-sm text-gray-500">
                            Showing page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {showTransactionModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-auto max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-900">Withdrawal Details</h3>
                            <button
                                onClick={() => setShowTransactionModal(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`flex items-center gap-3 p-4 rounded-lg border ${getStatusColor(selectedTransaction.status)} bg-opacity-10 border-opacity-20`}>
                                <AlertCircle className="w-5 h-5" />
                                <div>
                                    <p className="font-semibold capitalize">Status: {selectedTransaction.status}</p>
                                    <p className="text-xs opacity-90">{selectedTransaction.note || 'No additional notes'}</p>
                                </div>
                            </div>

                            {/* Main Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Info</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Amount</span>
                                            <span className="font-bold text-gray-900">₦{parseFloat(selectedTransaction.amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Date</span>
                                            <span className="text-gray-900">{new Date(selectedTransaction.created_at).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Gateway</span>
                                            <span className="text-gray-900 capitalize">{selectedTransaction.gateway || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-600">Reference</span>
                                            <span className="text-gray-900 font-mono text-xs">{selectedTransaction.reference || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Seller Info</h4>
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <User className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900 font-medium">{selectedTransaction.user?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <Store className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900">{selectedTransaction.user?.seller?.store_name}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 pl-7">
                                            {selectedTransaction.user?.email}
                                        </div>
                                        <div className="text-xs text-gray-500 pl-7">
                                            {selectedTransaction.user?.seller?.business_phone_number}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row    justify-end gap-3">
                            <Button
                                onClick={() => setShowTransactionModal(false)}
                                className=" px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                <span className='text-gray-700'>Close</span>

                            </Button>

                            {selectedTransaction.status === 'pending' && (
                                <>
                                    <Button
                                        onClick={() => handleReject(selectedTransaction.id)}
                                        disabled={isProcessing}
                                        className="flex items-center gap-2 px-4 py-2  bg-white border border-red-200 rounded-lg hover:bg-red-50 font-medium disabled:opacity-50"
                                    >
                                        <span className='text-red-700 flex items-center gap-2'>
                                            <XCircle className="w-4 h-4" />
                                            Reject Request
                                        </span>
                                    </Button>
                                    <Button
                                        onClick={() => handleApprove(selectedTransaction.id)}
                                        disabled={isProcessing}
                                        className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 font-medium shadow-sm disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                        Approve & Pay
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                isLoading={isProcessing}
            />
        </DashboardLayout>
    );
};

export default TransactionOversight;