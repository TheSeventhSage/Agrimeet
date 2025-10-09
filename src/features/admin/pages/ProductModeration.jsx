import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
    Package,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    DollarSign,
    Tag,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    ImageIcon
} from 'lucide-react';
import adminService from '../api/adminService';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import { showSuccess, showError } from '../../../shared/utils/alert';

const ProductModeration = () => {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalNotes, setApprovalNotes] = useState('');
    
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        status: 'pending',
        page: 1
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total: 0
    });

    useEffect(() => {
        loadProducts();
        loadStats();
    }, [filters]);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getPendingProducts(filters);
            setProducts(response.data.data || response.data);
            setPagination(response.data.meta || response.data.pagination || {
                current_page: 1,
                total_pages: 1,
                total: response.data.length || 0
            });
        } catch (error) {
            console.error('Failed to load products:', error);
            showError('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await adminService.getProductStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleViewProduct = async (product) => {
        try {
            const response = await adminService.getProductById(product.id);
            setSelectedProduct(response.data);
            setShowProductModal(true);
        } catch (error) {
            showError('Failed to load product details');
        }
    };

    const handleApproveProduct = (product) => {
        setSelectedProduct(product);
        setApprovalNotes('');
        setConfirmAction({
            type: 'approve',
            title: 'Approve Product',
            message: `Are you sure you want to approve "${product.name}"? It will be published on the platform.`,
            confirmText: 'Approve',
            showInput: true,
            inputLabel: 'Approval Notes (Optional)',
            inputValue: approvalNotes,
            onInputChange: setApprovalNotes,
            onConfirm: async () => {
                try {
                    await adminService.approveProduct(product.id, approvalNotes);
                    showSuccess('Product approved successfully');
                    loadProducts();
                    loadStats();
                    setShowConfirmModal(false);
                    setShowProductModal(false);
                } catch (error) {
                    showError('Failed to approve product');
                }
            }
        });
        setShowConfirmModal(true);
    };

    const handleRejectProduct = (product) => {
        setSelectedProduct(product);
        setRejectionReason('');
        setConfirmAction({
            type: 'reject',
            title: 'Reject Product',
            message: `Are you sure you want to reject "${product.name}"? The seller will be notified.`,
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
                    await adminService.rejectProduct(product.id, rejectionReason);
                    showSuccess('Product rejected');
                    loadProducts();
                    loadStats();
                    setShowConfirmModal(false);
                    setShowProductModal(false);
                } catch (error) {
                    showError('Failed to reject product');
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
            icon: Package,
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
                    <h1 className="text-3xl font-bold text-gray-900">Product Moderation</h1>
                    <p className="text-gray-600 mt-2">Review and moderate product listings before they go live</p>
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
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">All Categories</option>
                                <option value="grains">Grains</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                                <option value="livestock">Livestock</option>
                                <option value="dairy">Dairy</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
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

                {/* Products Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="lg:col-span-2 xl:col-span-3 flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="lg:col-span-2 xl:col-span-3 bg-white rounded-xl shadow-xs border border-gray-100 p-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No products found</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Product Image */}
                                <div className="h-48 bg-gray-100 relative">
                                    {product.images && product.images[0] ? (
                                        <img
                                            src={product.images[0].url || product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        {getStatusBadge(product.moderation_status || product.status || 'pending')}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description || 'No description'}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                Price
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                ${product.price || product.base_price || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-1">
                                                <Tag className="w-4 h-4" />
                                                Category
                                            </span>
                                            <span className="text-gray-900">{product.category?.name || product.category || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                Seller
                                            </span>
                                            <span className="text-gray-900">{product.seller?.name || product.seller_name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Submitted
                                            </span>
                                            <span className="text-gray-900">
                                                {new Date(product.created_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                        <button
                                            onClick={() => handleViewProduct(product)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        {(product.moderation_status === 'pending' || product.status === 'pending') && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveProduct(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectProduct(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && products.length > 0 && (
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 px-6 py-4 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{((pagination.current_page - 1) * 10) + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(pagination.current_page * 10, pagination.total)}</span> of{' '}
                            <span className="font-medium">{pagination.total}</span> products
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
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

            {/* Product Details Modal */}
            {showProductModal && selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">ID: {selectedProduct.id}</p>
                                </div>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Product Images */}
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {selectedProduct.images.map((image, index) => (
                                            <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={image.url || image}
                                                    alt={`${selectedProduct.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Product Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Price</label>
                                        <p className="text-gray-900 text-lg font-semibold">
                                            ${selectedProduct.price || selectedProduct.base_price || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Category</label>
                                        <p className="text-gray-900">{selectedProduct.category?.name || selectedProduct.category || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Stock Quantity</label>
                                        <p className="text-gray-900">{selectedProduct.stock_quantity || 0}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Unit</label>
                                        <p className="text-gray-900">{selectedProduct.unit || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600">Description</label>
                                        <p className="text-gray-900">{selectedProduct.description || 'No description'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Seller Name</label>
                                        <p className="text-gray-900">{selectedProduct.seller?.name || selectedProduct.seller_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Seller ID</label>
                                        <p className="text-gray-900">{selectedProduct.seller?.id || selectedProduct.seller_id || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {(selectedProduct.moderation_status === 'pending' || selectedProduct.status === 'pending') && (
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleApproveProduct(selectedProduct)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Approve Product
                                    </button>
                                    <button
                                        onClick={() => handleRejectProduct(selectedProduct)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Reject Product
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

export default ProductModeration;