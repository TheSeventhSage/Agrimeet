// components/OrdersList.jsx
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { LoadingSpinner } from '../../../shared/components/Loader';
import { STATUS_CONFIG } from '../api/orderService';

const OrdersList = ({
    orders,
    isLoading,
    onViewDetails,
    onPageChange,
    pagination
}) => {

    // Helper to render a status badge
    const StatusBadge = ({ type, status }) => {
        const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize border ${config.color} mb-1 mr-1`}>
                <span className="text-[10px] uppercase text-gray-400 mr-1 font-bold">{type}:</span>
                {config.label}
            </span>
        );
    };

    // Pagination Logic for Page Numbers
    const getPageNumbers = () => {
        const pages = [];
        const { current_page, last_page } = pagination;

        // Always show first page
        pages.push(1);

        if (current_page > 3) {
            pages.push('...');
        }

        // Show pages around current
        for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
            pages.push(i);
        }

        if (current_page < last_page - 2) {
            pages.push('...');
        }

        // Always show last page if > 1
        if (last_page > 1) {
            pages.push(last_page);
        }

        return pages;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                <p className="text-gray-500 mt-1">There are no orders in this category.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Order Ref</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 w-1/3">Status Overview</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        <div className="font-medium">{order.customer?.name}</div>
                                        <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            <StatusBadge type="Pay" status={order.paymentStatus} />
                                            <StatusBadge type="Ord" status={order.orderStatus} />
                                            <StatusBadge type="Ful" status={order.fulfillmentStatus} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ₦{order.totalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewDetails(order.id)}
                                            className="text-brand-600 hover:text-brand-700"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Numbered Pagination Footer */}
                {pagination.last_page > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div className="text-sm text-gray-500 hidden sm:block">
                            Showing page <span className="font-medium">{pagination.current_page}</span> of <span className="font-medium">{pagination.last_page}</span>
                        </div>
                        <div className="flex items-center space-x-1 mx-auto sm:mx-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page <= 1}
                                className="px-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                    <span key={`dots-${index}`} className="px-2 text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => onPageChange(page)}
                                        className={`min-w-[32px] h-8 rounded-md text-sm font-medium transition-colors ${pagination.current_page === page
                                            ? 'bg-brand-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page >= pagination.last_page}
                                className="px-2"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersList;