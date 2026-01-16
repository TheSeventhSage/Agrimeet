import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import OrderDetails from '../components/OrderDetails';
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Package,
    Truck,
    CreditCard,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
    AlertTriangle,
    ShoppingBag,
    User
} from 'lucide-react';
import adminOrderService from '../api/adminOrderService';
import { showSuccess, showError } from '../../../../shared/utils/alert';

const OrderManagement = () => {
    // Initial state as empty array to be safe
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filters & Pagination
    const [filters, setFilters] = useState({
        page: 1,
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 20
    });

    useEffect(() => {
        loadOrders();
    }, [filters.page]);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const response = await adminOrderService.getOrders(filters);

            // --- FIX FOR MAP ERROR ---
            // The API returns { data: [...], meta: {...} }
            // If using axios, this entire object is in response.data

            let ordersArray = [];
            let metaData = {};

            // Robust check to find where the array is hiding
            if (response.data && Array.isArray(response.data.data)) {
                // Axios response with standard Laravel API structure
                ordersArray = response.data.data;
                metaData = response.data.meta || {};
            } else if (response.data && Array.isArray(response.data)) {
                // Axios response where root data is the array
                ordersArray = response.data;
            } else if (Array.isArray(response.data)) {
                // Direct response object
                ordersArray = response.data;
            } else if (response.data?.data) {
                // Fallback for weird structures
                ordersArray = response.data.data;
                metaData = response.data.meta || {};
            }

            setOrders(ordersArray || []);

            if (metaData && Object.keys(metaData).length > 0) {
                setPagination({
                    current_page: metaData.current_page || 1,
                    last_page: metaData.last_page || 1,
                    total: metaData.total || 0,
                    per_page: metaData.per_page || 20
                });
            }

        } catch (error) {
            showError('Failed to load orders');
            console.error(error);
            setOrders([]); // Ensure it stays an array on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            setFilters(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600">Track and manage customer orders</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500">Total Orders: </span>
                    <span className="font-semibold text-gray-900">{pagination.total}</span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order Ref</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Fulfillment</th>
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
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                                            <p className="text-xs text-gray-500">ID: {order.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-medium text-xs">
                                                    {order.customer_fullname?.charAt(0) || <User className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{order.customer_fullname}</p>
                                                    <p className="text-xs text-gray-500">{order.customer_phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                ₦{parseFloat(order.total_amount).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${order.fulfillment_status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.fulfillment_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewOrder(order)}
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
                {!isLoading && orders.length > 0 && (
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

            {/* Comprehensive Order Details Modal */}
            {showDetailModal && selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </DashboardLayout>
    );
};

export default OrderManagement;