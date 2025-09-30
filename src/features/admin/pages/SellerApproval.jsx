import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    FileCheck,
    Search,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    FileText,
    User,
    Building,
    MapPin,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    X
} from 'lucide-react';
import adminService from '../api/adminService';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { showSuccess, showError } from '../../../shared/utils/alert';

const SellerApproval = () => {
    const [kycApplications, setKycApplications] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [showKycModal, setShowKycModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    
    const [filters, setFilters] = useState({
        search: '',
        status: 'pending',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total: 0
    });

    useEffect(() => {
        loadKycApplications();
        loadStats();
    }, [filters]);

    const loadKycApplications = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getPendingKyc(filters);
            setKycApplications(response.data.data || response.data);
            setPagination(response.data.meta || response.data.pagination || {
                current_page: 1,
                total_pages: 1,
                total: response.data.length || 0
            });
        } catch (error) {
            console.error('Failed to load KYC applications:', error);
            showError('Failed to load KYC applications');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminService.getKycStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleViewKyc = async (kyc) => {
        try {
            const response = await adminService.getKycById(kyc.id);
            setSelectedKyc(response.data);
            setShowKycModal(true);
        } catch (error) {
            showError('Failed to load KYC details');
        }
    };

    const handleApproveKyc = (kyc) => {
        setSelectedKyc(kyc);
        setApprovalNotes('');
        setConfirmAction({
            type: 'approve',
            title: 'Approve KYC Application',
            message: `Are you sure you want to approve the KYC application for ${kyc.business_name || kyc.user_name}?`,
            confirmText: 'Approve',
            showInput: true,
            inputLabel: 'Approval Notes (Optional)',
            inputValue: approvalNotes,
            onInputChange: setApprovalNotes,
            onConfirm: async () => {
                try {
                    await adminService.approveKyc(kyc.id, approvalNotes);
                    showSuccess('KYC application approved successfully');
                    loadKycApplications();
                    loadStats();
                    setShowConfirmModal(false);
                    setShowKycModal(false);
                } catch (error) {
                    showError('Failed to approve KYC application');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const handleRejectKyc = (kyc) => {
        setSelectedKyc(kyc);
        setRejectionReason('');
        setConfirmAction({
            type: 'reject',
            title: 'Reject KYC Application',
            message: `Are you sure you want to reject the KYC application for ${kyc.business_name || kyc.user_name}?`,
            confirmText: 'Reject',
            showInput: true,
            inputLabel: 'Rejection Reason (Required)',
            inputValue: rejectionReason,
            onInputChange: setRejectionReason,
            onConfirm: async () => {
                if (!rejectionReason.trim()) {
                    showError('Please provide a rejection reason');
                    return;
                }
                try {
                    await adminService.rejectKyc(kyc.id, rejectionReason);
                    showSuccess('KYC application rejected');
                    loadKycApplications();
                    loadStats();
                    setShowConfirmModal(false);
                    setShowKycModal(false);
                } catch (error) {
                    showError('Failed to reject KYC application');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Review' },
            approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Approved' },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Rejected' },
            under_review: { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Under Review' }
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

    const statCards = [
        {
            title: 'Pending Review',
            value: stats.pending || 0,
            icon: Clock,
            color: 'bg-yellow-500'
        },
        {
            title: 'Approved Today',
            value: stats.approvedToday || 0,
            icon: CheckCircle,
            color: 'bg-green-500'
        },
        {
            title: 'Total Approved',
            value: stats.totalApproved || 0,
            icon: FileCheck,
            color: 'bg-blue-500'
        },
        {
            title: 'Rejected',
            value: stats.rejected || 0,
            icon: XCircle,
            color: 'bg-red-500'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Seller Approval</h1>
                    <p className="text-gray-600 mt-2">Review and verify seller KYC applications</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by business name, user name, or ID..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* KYC Applications Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="lg:col-span-2 flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : kycApplications.length === 0 ? (
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No KYC applications found</p>
                        </div>
                    ) : (
                        kycApplications.map((kyc) => (
                            <div key={kyc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                                            <Building className="w-6 h-6 text-brand-700" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{kyc.business_name || 'N/A'}</h3>
                                            <p className="text-sm text-gray-600">{kyc.user_name || kyc.email}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(kyc.status || 'pending')}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>{kyc.contact_person || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{kyc.address || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Applied: {new Date(kyc.created_at || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <FileText className="w-4 h-4" />
                                        <span>ID: {kyc.id_number || kyc.business_registration_number || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleViewKyc(kyc)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    {kyc.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApproveKyc(kyc)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectKyc(kyc)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && kycApplications.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.current_page - 1) * 10) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> applications
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

            {/* Confirmation Modal */}
            {showConfirmModal && confirmAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                {confirmAction.type === 'approve' ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                )}
                                <h3 className="text-lg font-semibold text-gray-900">{confirmAction.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 mb-4">{confirmAction.message}</p>
                            {confirmAction.showInput && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {confirmAction.inputLabel}
                                    </label>
                                    <textarea
                                        value={confirmAction.inputValue}
                                        onChange={(e) => confirmAction.onInputChange(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        placeholder={`Enter ${confirmAction.type === 'approve' ? 'notes' : 'reason'}...`}
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction.onConfirm}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        confirmAction.type === 'approve'
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                                >
                                    {confirmAction.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* KYC Details Modal */}
            {showKycModal && selectedKyc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">KYC Application Details</h3>
                                    <p className="text-sm text-gray-600 mt-1">ID: {selectedKyc.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowKycModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Business Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Business Name</label>
                                        <p className="text-gray-900">{selectedKyc.business_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Registration Number</label>
                                        <p className="text-gray-900">{selectedKyc.business_registration_number || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Business Type</label>
                                        <p className="text-gray-900">{selectedKyc.business_type || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Tax ID</label>
                                        <p className="text-gray-900">{selectedKyc.tax_id || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Address</label>
                                        <p className="text-gray-900">{selectedKyc.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Contact Person</label>
                                        <p className="text-gray-900">{selectedKyc.contact_person || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email</label>
                                        <p className="text-gray-900">{selectedKyc.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Phone</label>
                                        <p className="text-gray-900">{selectedKyc.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Alternative Phone</label>
                                        <p className="text-gray-900">{selectedKyc.alternative_phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    {selectedKyc.documents && selectedKyc.documents.length > 0 ? (
                                        selectedKyc.documents.map((doc, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-center text-gray-600">{doc.type || `Document ${index + 1}`}</p>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-brand-600 hover:underline block text-center mt-2"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 col-span-3 text-center">No documents uploaded</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {selectedKyc.status === 'pending' && (
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleApproveKyc(selectedKyc)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Application
                                    </button>
                                    <button
                                        onClick={() => handleRejectKyc(selectedKyc)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject Application
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default SellerApproval;