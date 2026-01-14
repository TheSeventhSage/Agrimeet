import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import {
    AlertTriangle,
    Search,
    Eye,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    User,
    Package,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    Send,
    DollarSign,
    FileText,
    ShoppingCart,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import adminDisputeService from '../api/adminDisputeService';
import { showSuccess, showError } from '../../../../shared/utils/alert';

const DisputeManagement = () => {
    const [disputes, setDisputes] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [resolution, setResolution] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        priority: 'all',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total: 0
    });

    useEffect(() => {
        loadDisputes();
    }, [filters]);

    const loadDisputes = async () => {
        try {
            setIsLoading(true);
            const response = await adminDisputeService.getAllDisputes(filters);
            const data = response.data.data || response.data || [];
            setDisputes(data);

            setPagination(response.data.meta || response.data.pagination || {
                current_page: 1,
                total_pages: 1,
                total: data.length || 0
            });
        } catch (error) {
            console.error('Failed to load disputes:', error);
            showError('Failed to load disputes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDispute = async (dispute) => {
        try {
            const response = await adminDisputeService.getDisputeById(dispute.id);
            console.log(response);
            setSelectedDispute(response.data.data);
            setShowDisputeModal(true);
        } catch (error) {
            showError('Failed to load dispute details');
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) {
            showError('Please enter a note');
            return;
        }
        showError('Add Note API endpoint not available');
    };

    const handleResolveDispute = async () => {
        if (!resolution.trim()) {
            showError('Please provide a resolution');
            return;
        }
        try {
            setActionLoading(true);
            await adminDisputeService.settleDispute(selectedDispute.id, {
                resolution: resolution,
                status: 'settled'
            });

            showSuccess('Dispute settled successfully');
            setShowDisputeModal(false);
            setResolution('');
            setRefundAmount('');
            loadDisputes();
        } catch (error) {
            console.error(error);
            showError('Failed to resolve dispute');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (status === 'rejected') {
            if (!resolution.trim()) {
                showError('Please provide a reason for rejection');
                return;
            }
            try {
                setActionLoading(true);
                await adminDisputeService.settleDispute(selectedDispute.id, {
                    resolution: resolution,
                    status: 'rejected'
                });
                showSuccess('Dispute rejected successfully');
                setShowDisputeModal(false);
                setResolution('');
                loadDisputes();
            } catch (error) {
                showError('Failed to update status');
            } finally {
                setActionLoading(false);
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            open: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Open' },
            in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'In Progress' },
            resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' },
            settled: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Settled' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
            closed: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Closed' }
        };

        const config = statusConfig[status] || statusConfig.open;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const statusColors = {
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pending}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending'}
            </span>
        );
    };

    const filteredDisputes = disputes.filter(dispute => {
        const matchesSearch = filters.search === '' ||
            dispute.reason?.toLowerCase().includes(filters.search.toLowerCase()) ||
            dispute.order?.order_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
            dispute.user?.first_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
            dispute.user?.last_name?.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = filters.status === 'all' || dispute.status === filters.status;

        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
                    <p className="text-gray-600 mt-2">Handle buyer-seller disputes and resolve issues</p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by reason, order number, or user..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="settled">Settled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        </div>
                    ) : filteredDisputes.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No disputes found</p>
                        </div>
                    ) : (
                        filteredDisputes.map((dispute) => (
                            <div key={dispute.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Dispute #{dispute.id}
                                                </h3>
                                                {getStatusBadge(dispute.status)}
                                            </div>
                                            <p className="text-gray-600 mb-4 line-clamp-2">{dispute.reason}</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1 mb-1">
                                                        <User className="w-4 h-4" />
                                                        Customer
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {dispute.user?.first_name} {dispute.user?.last_name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1 mb-1">
                                                        <Package className="w-4 h-4" />
                                                        Order Number
                                                    </span>
                                                    <p className="font-medium text-gray-900">{dispute.order?.order_number}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1 mb-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        Order Amount
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {dispute.order?.currency} {parseFloat(dispute.order?.total_amount).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1 mb-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Created
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(dispute.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDispute(dispute)}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-4 shrink-0"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && filteredDisputes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{filteredDisputes.length}</span> of{' '}
                            <span className="font-medium">{disputes.length}</span> disputes
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

            {/* Dispute Details Modal */}
            {showDisputeModal && selectedDispute && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Dispute Details</h3>
                                    <p className="text-sm text-gray-600 mt-1">Dispute ID: #{selectedDispute.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowDisputeModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                {getStatusBadge(selectedDispute.status)}
                                {getPaymentStatusBadge(selectedDispute.order?.payment_status)}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Dispute Reason */}
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-red-900 mb-2">Dispute Reason</h4>
                                        <p className="text-red-800 whitespace-pre-line">{selectedDispute.reason}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Order Information
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order Number</label>
                                        <p className="text-gray-900 font-semibold">{selectedDispute.order?.order_number}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Total Amount</label>
                                        <p className="text-gray-900 font-semibold">
                                            {selectedDispute.order?.currency} {parseFloat(selectedDispute.order?.total_amount).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Payment Status</label>
                                        <div className="mt-1">
                                            {getPaymentStatusBadge(selectedDispute.order?.payment_status)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order Status</label>
                                        <p className="text-gray-900">{selectedDispute.order?.order_status}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Fulfillment</label>
                                        <p className="text-gray-900">{selectedDispute.order?.fulfillment_status}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tracking Number</label>
                                        <p className="text-gray-900">{selectedDispute.order?.tracking_number || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Customer Information
                                </h4>
                                <div className="border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        {selectedDispute.user?.profile_photo ? (
                                            <img
                                                src={selectedDispute.user.profile_photo}
                                                alt="User"
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                                <User className="w-8 h-8 text-green-600" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-gray-900 text-lg mb-3">
                                                {selectedDispute.user?.first_name} {selectedDispute.user?.last_name}
                                            </h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{selectedDispute.user?.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{selectedDispute.user?.phone_number}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedDispute.user?.user_status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {selectedDispute.user?.user_status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information */}
                            {selectedDispute.order?.courier_name && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Shipping Information
                                    </h4>
                                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Courier</label>
                                            <p className="text-gray-900">{selectedDispute.order.courier_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Shipping Amount</label>
                                            <p className="text-gray-900">
                                                {selectedDispute.order.currency} {parseFloat(selectedDispute.order.shipping_amount).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Delivery Charge</label>
                                            <p className="text-gray-900">
                                                {selectedDispute.order.currency} {parseFloat(selectedDispute.order.delivery_charge).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resolution Section */}
                            {selectedDispute.status !== 'settled' && selectedDispute.status !== 'rejected' && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Resolve Dispute
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Resolution Details *
                                            </label>
                                            <textarea
                                                value={resolution}
                                                onChange={(e) => setResolution(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Provide detailed resolution or reason for rejection..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Refund Amount (Optional)
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <input
                                                    type="number"
                                                    value={refundAmount}
                                                    onChange={(e) => setRefundAmount(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <button
                                                onClick={() => handleUpdateStatus('rejected')}
                                                disabled={actionLoading}
                                                className="flex-1 px-6 py-3 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {actionLoading ? 'Processing...' : 'Reject Dispute'}
                                            </button>
                                            <button
                                                onClick={handleResolveDispute}
                                                disabled={actionLoading}
                                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {actionLoading ? 'Processing...' : 'Settle Dispute'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Resolution Display (if already resolved) */}
                            {selectedDispute.resolution && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Resolution
                                    </h4>
                                    <p className="text-green-800 whitespace-pre-line">{selectedDispute.resolution}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default DisputeManagement;