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
    Send
} from 'lucide-react';
// Changed import to the new service file
import adminDisputeService from '../api/adminDisputeService';
import { showSuccess, showError } from '../../../../shared/utils/alert';

const DisputeManagement = () => {
    const [disputes, setDisputes] = useState([]);
    // Stats will default to 0 as API endpoint was not provided for stats
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [resolution, setResolution] = useState('');
    const [refundAmount, setRefundAmount] = useState('');

    const [filters, setFilters] = useState({
        search: '',
        status: 'open',
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
        // loadStats(); // Commented out as no API endpoint was provided for stats
    }, [filters]);

    const loadDisputes = async () => {
        try {
            setIsLoading(true);
            const response = await adminDisputeService.getAllDisputes(filters);

            // Handle response structure based on common patterns or simple array
            const data = response.data.data || response.data || [];

            setDisputes(data);

            // Set pagination if available, otherwise default (API definition returned simple array)
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

    /* // Stats endpoint not provided in Swagger definition. 
    // Commenting out to prevent 404s, but keeping structure if needed later.
    const loadStats = async () => {
        try {
            const response = await adminService.getDisputeStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };
    */

    const handleViewDispute = async (dispute) => {
        try {
            const response = await adminDisputeService.getDisputeById(dispute.id);
            setSelectedDispute(response.data);
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
        // NOTE: The provided API definition does not have an endpoint for adding notes.
        // This is a placeholder to preserve UI functionality without crashing.
        showError('Add Note API endpoint not available');

        /* try {
            await adminService.addDisputeNote(selectedDispute.id, newNote);
            showSuccess('Note added successfully');
            setNewNote('');
            const response = await adminDisputeService.getDisputeById(selectedDispute.id);
            setSelectedDispute(response.data);
        } catch (error) {
            showError('Failed to add note');
        }
        */
    };

    const handleResolveDispute = async () => {
        if (!resolution.trim()) {
            showError('Please provide a resolution');
            return;
        }
        try {
            // Using the 'settle' endpoint with status: 'settled'
            await adminDisputeService.settleDispute(selectedDispute.id, {
                resolution: resolution,
                status: 'settled'
            });

            showSuccess('Dispute settled successfully');
            setShowDisputeModal(false);
            loadDisputes();
            // loadStats(); 
        } catch (error) {
            console.error(error);
            showError('Failed to resolve dispute');
        }
    };

    // Updated to handle Reject logic using the same endpoint
    const handleUpdateStatus = async (status) => {
        // The API only supports "settled" or "rejected" via the settle endpoint
        if (status === 'rejected') {
            if (!resolution.trim()) {
                showError('Please provide a reason for rejection');
                return;
            }
            try {
                await adminDisputeService.settleDispute(selectedDispute.id, {
                    resolution: resolution,
                    status: 'rejected'
                });
                showSuccess('Dispute rejected successfully');
                const response = await adminDisputeService.getDisputeById(selectedDispute.id);
                setSelectedDispute(response.data);
                loadDisputes();
            } catch (error) {
                showError('Failed to update status');
            }
        } else {
            // For visual UI updates like 'in_progress', if backend doesn't support it,
            // we might just show a message or need a different endpoint.
            // Assuming for now we just show a message as the API is strictly 'settle/reject'.
            showError('API only supports Settling or Rejecting disputes currently.');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            open: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Open' },
            in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'In Progress' },
            resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Resolved' },
            settled: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Settled' }, // Added for new API enum
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' }, // Added for new API enum
            closed: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Closed' }
        };

        const config = statusConfig[status] || statusConfig.open;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityColors = {
            high: 'bg-red-100 text-red-800',
            medium: 'bg-yellow-100 text-yellow-800',
            low: 'bg-green-100 text-green-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority] || priorityColors.medium}`}>
                {priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'Medium'}
            </span>
        );
    };

    const statCards = [
        {
            title: 'Open Disputes',
            value: stats.open || 0,
            icon: AlertCircle,
            color: 'bg-blue-500'
        },
        {
            title: 'In Progress',
            value: stats.inProgress || 0,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Resolved Today',
            value: stats.resolvedToday || 0,
            icon: CheckCircle,
            color: 'bg-green-500'
        },
        {
            title: 'Total Resolved',
            value: stats.totalResolved || 0,
            icon: CheckCircle,
            color: 'bg-purple-500'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
                    <p className="text-gray-600 mt-2">Handle buyer-seller disputes and resolve issues</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search disputes..."
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
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="settled">Settled</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div>
                            <select
                                value={filters.priority}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                            </div>
                        </div>
                    ) : disputes.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No disputes found</p>
                        </div>
                    ) : (
                        disputes.map((dispute) => (
                            <div key={dispute.id} className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{dispute.title || 'Dispute'}</h3>
                                                {getStatusBadge(dispute.status || 'open')}
                                                {getPriorityBadge(dispute.priority || 'medium')}
                                            </div>
                                            <p className="text-gray-600 mb-3">{dispute.description || 'No description'}</p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        Buyer
                                                    </span>
                                                    <p className="font-medium text-gray-900">{dispute.buyer_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        Seller
                                                    </span>
                                                    <p className="font-medium text-gray-900">{dispute.seller_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <Package className="w-4 h-4" />
                                                        Order ID
                                                    </span>
                                                    <p className="font-medium text-gray-900">{dispute.order_id || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Created
                                                    </span>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(dispute.created_at || Date.now()).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDispute(dispute)}
                                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors ml-4"
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
                {!isLoading && disputes.length > 0 && (
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.current_page - 1) * 10) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> disputes
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
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedDispute.title || 'Dispute Details'}</h3>
                                    <p className="text-sm text-gray-600 mt-1">ID: {selectedDispute.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowDisputeModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Status and Priority */}
                            <div className="flex items-center gap-3">
                                {getStatusBadge(selectedDispute.status)}
                                {getPriorityBadge(selectedDispute.priority)}
                            </div>

                            {/* Dispute Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Dispute Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Order ID</label>
                                        <p className="text-gray-900">{selectedDispute.order_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Created Date</label>
                                        <p className="text-gray-900">
                                            {new Date(selectedDispute.created_at || Date.now()).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Description</label>
                                        <p className="text-gray-900">{selectedDispute.description || 'No description'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Parties Involved */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Parties Involved</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-900 mb-2">Buyer</h5>
                                        <p className="text-gray-900">{selectedDispute.buyer_name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{selectedDispute.buyer_email || ''}</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-900 mb-2">Seller</h5>
                                        <p className="text-gray-900">{selectedDispute.seller_name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{selectedDispute.seller_email || ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h4>
                                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                    {selectedDispute.notes && selectedDispute.notes.length > 0 ? (
                                        selectedDispute.notes.map((note, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-900">{note.admin_name || 'Admin'}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(note.created_at || Date.now()).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">{note.content || note.note}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 text-sm">No notes yet</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Add a note..."
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Resolution */}
                            {/* Check against new 'settled' and 'rejected' statuses as well */}
                            {selectedDispute.status !== 'resolved' &&
                                selectedDispute.status !== 'closed' &&
                                selectedDispute.status !== 'settled' &&
                                selectedDispute.status !== 'rejected' && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Resolve Dispute</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Resolution Details
                                                </label>
                                                <textarea
                                                    value={resolution}
                                                    onChange={(e) => setResolution(e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                                    placeholder="Enter resolution details..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Refund Amount (Optional)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={refundAmount}
                                                    onChange={(e) => setRefundAmount(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Changed 'Mark In Progress' to 'Reject' as API only supports settle/reject */}
                                                <button
                                                    onClick={() => handleUpdateStatus('rejected')}
                                                    className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Reject Dispute
                                                </button>
                                                <button
                                                    onClick={handleResolveDispute}
                                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    Settle Dispute
                                                </button>
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

export default DisputeManagement;