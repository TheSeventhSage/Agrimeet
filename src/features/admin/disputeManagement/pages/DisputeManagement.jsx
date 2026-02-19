import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import {
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight,
    XCircle,
    CheckCircle,
    X,
    AlertTriangle,
    Package
} from 'lucide-react';
import adminDisputeService from '../api/adminDisputeService';
import { showSuccess, showError } from '../../../../shared/utils/alert';
import DisputeDetailsModal from '../components/DisputeDetailsModal';

const DisputeManagement = () => {
    const [disputes, setDisputes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [showDisputeModal, setShowDisputeModal] = useState(false);

    // Resolution Action State
    const [showActionModal, setShowActionModal] = useState(false);
    const [resolutionNote, setResolutionNote] = useState('');
    const [resolutionStatus, setResolutionStatus] = useState('settled'); // 'settled' or 'rejected'
    const [actionLoading, setActionLoading] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
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

            const data = response.data?.data || response.data || [];
            const meta = response.data?.meta || {};

            setDisputes(Array.isArray(data) ? data : []);

            if (meta.total) {
                setPagination({
                    current_page: meta.current_page,
                    total_pages: meta.last_page,
                    total: meta.total
                });
            }
        } catch (error) {
            console.error('Error loading disputes:', error);
            showError('Failed to load disputes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDispute = (dispute) => {
        setSelectedDispute(dispute);
        setShowDisputeModal(true);
    };

    const handleResolveClick = (dispute) => {
        setSelectedDispute(dispute);
        setShowDisputeModal(false); // Close details modal
        setResolutionStatus('settled'); // Default to settled
        setResolutionNote('');
        setShowActionModal(true); // Open action modal
    };

    const submitResolution = async () => {
        if (!resolutionNote.trim()) {
            showError('Please provide a reason for this decision');
            return;
        }

        try {
            setActionLoading(true);

            // API call with dynamic status and reason
            await adminDisputeService.settleDispute(selectedDispute.id, {
                resolution: resolutionNote,
                status: resolutionStatus
            });

            showSuccess(`Dispute marked as ${resolutionStatus}`);
            setShowActionModal(false);
            setResolutionNote('');
            loadDisputes(); // Refresh list
        } catch (error) {
            console.error(error);
            showError('Failed to process dispute resolution');
        } finally {
            setActionLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-yellow-100 text-yellow-700';
            case 'settled': return 'bg-green-100 text-green-700'; // Specific for settled
            case 'resolved': return 'bg-green-100 text-green-700'; // Specific for resolved
            case 'rejected': return 'bg-red-100 text-red-700';    // Specific for rejected
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-blue-50 text-blue-700';
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dispute Management</h1>
                    <p className="text-gray-600">Handle and resolve customer disputes</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500">Total Disputes: </span>
                    <span className="font-semibold text-gray-900">{pagination.total}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or user..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                            className="w-[60%] sm:w-[40%] border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="settled">Settled</option>
                            <option value="rejected">Rejected</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Dispute ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : disputes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No disputes found.
                                    </td>
                                </tr>
                            ) : (
                                disputes.map((dispute) => (
                                    <tr key={dispute.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{dispute.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{dispute.order?.order_number || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {dispute.user?.first_name} {dispute.user?.last_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900 truncate max-w-[200px]" title={dispute.reason}>
                                                {dispute.reason}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(dispute.status)}`}>
                                                {dispute.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(dispute.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewDispute(dispute)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
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
                {!isLoading && disputes.length > 0 && (
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Page {pagination.current_page} of {pagination.total_pages}
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
                                disabled={pagination.current_page === pagination.total_pages}
                                className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* MAIN DETAILS MODAL */}
            {showDisputeModal && selectedDispute && (
                <DisputeDetailsModal
                    dispute={selectedDispute}
                    onClose={() => setShowDisputeModal(false)}
                    onResolve={handleResolveClick}
                />
            )}

            {/* RESOLUTION ACTION MODAL */}
            {showActionModal && selectedDispute && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Resolve Dispute #{selectedDispute.id}</h3>
                            <button onClick={() => setShowActionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Action Type Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Outcome Decision</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setResolutionStatus('settled')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${resolutionStatus === 'settled'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <CheckCircle className={`w-6 h-6 mb-2 ${resolutionStatus === 'settled' ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold text-sm">Settle Dispute</span>
                                </button>

                                <button
                                    onClick={() => setResolutionStatus('rejected')}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${resolutionStatus === 'rejected'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 hover:border-red-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <XCircle className={`w-6 h-6 mb-2 ${resolutionStatus === 'rejected' ? 'text-red-600' : 'text-gray-400'}`} />
                                    <span className="font-semibold text-sm">Reject Dispute</span>
                                </button>
                            </div>
                        </div>

                        {/* Reason Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {resolutionStatus === 'settled' ? 'Resolution Details' : 'Rejection Reason'}
                            </label>
                            <textarea
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                placeholder={resolutionStatus === 'settled'
                                    ? "Explain how the dispute was settled (e.g., refund processed, replacement sent)..."
                                    : "Explain why the dispute is being rejected..."
                                }
                                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 resize-none text-sm"
                            ></textarea>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setShowActionModal(false)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitResolution}
                                disabled={actionLoading}
                                className={`px-4 py-2 text-white rounded-lg font-medium shadow-sm flex items-center gap-2 disabled:opacity-50 transition-colors ${resolutionStatus === 'settled'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {actionLoading ? 'Processing...' : (resolutionStatus === 'settled' ? 'Confirm Settlement' : 'Confirm Rejection')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default DisputeManagement;