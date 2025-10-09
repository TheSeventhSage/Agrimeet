// components/OrderDetails.jsx
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Calendar, FileText, Edit3, Printer } from 'lucide-react';
import { useState } from 'react';
import Button from '../../../shared/components/Button';
import LoadingSpinner from '../../../shared/components/Loading';
import { STATUS_CONFIG } from '../api/orderService';

const OrderDetails = ({ order, onBack, onUpdateStatus, onPrintInvoice, isLoading }) => {
    const [showStatusUpdate, setShowStatusUpdate] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    if (isLoading || !order) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

    const formatCurrency = (amount) => {
        return `₦${amount.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusActions = (currentStatus) => {
        const actions = [];

        switch (currentStatus) {
            case 'pending':
                actions.push('confirmed', 'cancelled');
                break;
            case 'confirmed':
                actions.push('processing', 'cancelled');
                break;
            case 'processing':
                actions.push('shipped', 'cancelled');
                break;
            case 'shipped':
                actions.push('delivered');
                break;
            default:
                break;
        }

        return actions;
    };

    const statusActions = getStatusActions(order.status);

    const handleStatusUpdate = () => {
        if (selectedStatus) {
            onUpdateStatus(order.id, selectedStatus);
            setShowStatusUpdate(false);
            setSelectedStatus('');
        }
    };

    const getStatusTimeline = () => {
        const timeline = [
            { status: 'pending', label: 'Order Placed', completed: true },
            { status: 'confirmed', label: 'Order Confirmed', completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) },
            { status: 'processing', label: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(order.status) },
            { status: 'shipped', label: 'Shipped', completed: ['shipped', 'delivered'].includes(order.status) },
            { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
        ];

        if (order.status === 'cancelled') {
            return [
                { status: 'pending', label: 'Order Placed', completed: true },
                { status: 'cancelled', label: 'Order Cancelled', completed: true, error: true }
            ];
        }

        return timeline;
    };

    const timeline = getStatusTimeline();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Orders
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
                        <p className="text-gray-600">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>



                    <Button onClick={() => onPrintInvoice(order.id)}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                <div className="relative">
                    {timeline.map((step, index) => (
                        <div key={step.status} className="flex items-center mb-4 last:mb-0">
                            <div className={`w-4 h-4 rounded-full border-2 mr-4 ${step.completed
                                    ? step.error
                                        ? 'bg-red-500 border-red-500'
                                        : 'bg-brand-500 border-brand-500'
                                    : 'bg-white border-gray-300'
                                }`}>
                            </div>

                            {index < timeline.length - 1 && (
                                <div className={`absolute left-2 top-6 w-0.5 h-6 ${step.completed ? 'bg-brand-200' : 'bg-gray-200'
                                    }`} style={{ top: `${index * 32 + 16}px` }}>
                                </div>
                            )}

                            <span className={`text-sm font-medium ${step.completed
                                    ? step.error
                                        ? 'text-red-700'
                                        : 'text-brand-700'
                                    : 'text-gray-500'
                                }`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Name</p>
                            <p className="text-gray-900">{order.customer.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Email</p>
                            <p className="text-gray-900">{order.customer.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Phone</p>
                            <p className="text-gray-900">{order.customer.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                    </div>

                    <div className="text-gray-900">
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        <p>{order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                    </div>

                    {order.trackingNumber && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center mb-2">
                                <Truck className="w-4 h-4 text-gray-400 mr-2" />
                                <p className="text-sm font-medium text-gray-700">Tracking Number</p>
                            </div>
                            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-sm">{order.trackingNumber}</p>
                        </div>
                    )}
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Payment Method</p>
                            <p className="text-gray-900">{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Payment Status</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                        </div>

                        {order.estimatedDelivery && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Estimated Delivery</p>
                                <p className="text-gray-900">{formatDate(order.estimatedDelivery)}</p>
                            </div>
                        )}

                        {order.deliveredDate && (
                            <div>
                                <p className="text-sm font-medium text-gray-700">Delivered On</p>
                                <p className="text-gray-900">{formatDate(order.deliveredDate)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                <div className="flex items-center mb-6">
                    <Package className="w-5 h-5 text-gray-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900">Order Items ({order.items.length})</h2>
                </div>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-gray-600">Unit Price: {formatCurrency(item.price)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="max-w-sm ml-auto space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-gray-900">{formatCurrency(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">{formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex items-center mb-4">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-900">Order Notes</h2>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.notes}</p>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusUpdate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h3>

                            <div className="space-y-3 mb-6">
                                {statusActions.map(status => (
                                    <label key={status} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={selectedStatus === status}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="text-brand-600 focus:ring-brand-500"
                                        />
                                        <span className="ml-3 text-gray-900">
                                            Mark as {STATUS_CONFIG[status]?.label}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowStatusUpdate(false);
                                        setSelectedStatus('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleStatusUpdate}
                                    disabled={!selectedStatus}
                                    className="flex-1"
                                >
                                    Update Status
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;