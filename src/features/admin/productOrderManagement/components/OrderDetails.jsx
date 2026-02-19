import {
    X,
    Package,
    Truck,
    User,
    MapPin,
    CreditCard,
    Calendar,
    Hash,
    ExternalLink,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
    Box,
    ShoppingBag,
    Shield
} from 'lucide-react';

const OrderDetails = ({ order, onClose }) => {
    if (!order) return null;

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(parseFloat(amount || 0));
    };

    // Helper for null/empty values
    const val = (value) => value || <span className="text-gray-400 italic">N/A</span>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
            case 'delivered':
            case 'fulfilled':
                return 'bg-green-100 text-green-700';
            case 'pending':
            case 'unfulfilled':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="ml-0 md:ml-64 fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{order.order_number}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>ID: #{order.id}</span>
                                <span>•</span>
                                <span>{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Main Info (2 cols) */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Order Status Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.payment_status)}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Fulfillment</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.fulfillment_status)}`}>
                                        {order.fulfillment_status}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Order Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusColor(order.order_status)}`}>
                                        {order.order_status}
                                    </span>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">Paid At</p>
                                    <p className="text-xs font-medium text-gray-900 truncate" title={order.paid_at}>
                                        {order.paid_at ? new Date(order.paid_at).toLocaleDateString() : 'Not Paid'}
                                    </p>
                                </div>
                            </div>

                            {/* Tracking & Shipment Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-brand-600" />
                                        Shipping & Tracking Information
                                    </h3>
                                    {order.shipment && (
                                        <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(order.shipment.status)}`}>
                                            Shipment: {order.shipment.status}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Courier Service</p>
                                        <p className="font-medium text-gray-900">{val(order.courier_name)}</p>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5">Code: {val(order.courier_code)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                                        <p className="font-medium text-gray-900 font-mono">{val(order.tracking_number || order.shipment?.tracking_code)}</p>
                                    </div>

                                    {order.shipment ? (
                                        <div className="col-span-1 md:col-span-2 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-blue-600 font-semibold mb-1">Shipment ID: {order.shipment.shipment_id}</p>
                                                    <p className="text-xs text-blue-800">Created: {new Date(order.shipment.created_at).toLocaleString()}</p>
                                                </div>
                                                {order.shipment.tracking_url && (
                                                    <a
                                                        href={order.shipment.tracking_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Track Shipment <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500">No shipment generated yet</p>
                                            <p className="text-xs text-gray-400 mt-1 font-mono break-all px-4">Request Token: {val(order.shipping_request_token)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-brand-600" />
                                        Order Items ({order.items?.length || 0})
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-3 font-medium text-gray-500">Product</th>
                                                <th className="px-6 py-3 font-medium text-gray-500 text-center">Qty</th>
                                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Unit Price</th>
                                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Total</th>
                                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Commission</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.items?.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                                                                <img
                                                                    src={item.thumbnail}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => e.target.src = 'https://placehold.co/100?text=No+Img'}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                                <p className="text-xs text-gray-500">Seller ID: {item.seller_id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-gray-900">{item.quantity}</td>
                                                    <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(item.unit_price)}</td>
                                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(item.total_price)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className="text-red-600 text-xs font-medium">-{formatCurrency(item.platform_commission_amount)}</span>
                                                        <div className="text-[10px] text-gray-400">({item.platform_commission_rate}%)</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Customer & Finance (1 col) */}
                        <div className="space-y-6">

                            {/* Customer Details */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4 text-brand-600" />
                                    Customer Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-gray-100 rounded-full">
                                            <User className="w-3 h-3 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{val(order.customer_fullname)}</p>
                                            <p className="text-xs text-gray-500">User ID: {order.user_id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-gray-100 rounded-full">
                                            <Truck className="w-3 h-3 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{val(order.customer_phone)}</p>
                                            <p className="text-xs text-gray-500">Contact Number</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 p-1.5 bg-gray-100 rounded-full">
                                            <MapPin className="w-3 h-3 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-900">{val(order.customer_address)}</p>
                                            {order.customer_address_2 && <p className="text-sm text-gray-900">{order.customer_address_2}</p>}
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {[order.customer_city, order.customer_state, order.customer_country].filter(Boolean).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-brand-600" />
                                    Financial Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Shipping Cost</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(order.shipping_amount)}</span>
                                    </div>
                                    {parseFloat(order.shipping_discount) > 0 && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Shipping Discount</span>
                                            <span className="font-medium text-green-600">-{formatCurrency(order.shipping_discount)}</span>
                                        </div>
                                    )}

                                    <div className="border-t border-dashed border-gray-200 my-2"></div>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Platform Commission</span>
                                        <span className="font-medium text-red-600">-{formatCurrency(order.total_commission)}</span>
                                    </div>

                                    <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center mt-2 border border-green-100">
                                        <span className="text-sm font-medium text-green-800">Seller Earnings</span>
                                        <span className="text-lg font-bold text-green-800">{formatCurrency(order.total_seller_earnings)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Raw Data Toggle (Optional but requested) */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <details className="group">
                            <summary className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-900 select-none w-fit">
                                <Shield className="w-4 h-4" />
                                <span>View Raw Data (JSON)</span>
                            </summary>
                            <div className="mt-4 p-4 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto text-xs font-mono shadow-inner">
                                <pre>{JSON.stringify(order, null, 2)}</pre>
                            </div>
                        </details>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetails;