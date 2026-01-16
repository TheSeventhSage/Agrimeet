import {
    X,
    AlertCircle,
    User,
    Package,
    CreditCard,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Truck,
    MapPin,
    Shield,
    Phone,
    Mail
} from 'lucide-react';

const DisputeDetailsModal = ({ dispute, onClose, onResolve }) => {
    if (!dispute) return null;

    const { order, user } = dispute;

    // Helper for formatting currency
    const formatCurrency = (amount, currency = 'NGN') => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN'
        }).format(parseFloat(amount || 0));
    };

    // Helper for safe value display
    const val = (value) => value || <span className="text-gray-400 italic">N/A</span>;

    // Helper for status colors
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Dispute #{dispute.id}</h2>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Created: {new Date(dispute.created_at).toLocaleString()}</span>
                                {dispute.updated_at !== dispute.created_at && (
                                    <>
                                        <span>•</span>
                                        <span>Updated: {new Date(dispute.updated_at).toLocaleDateString()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Dispute & User Info (2 cols) */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Dispute Overview Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-brand-600" />
                                        Dispute Information
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(dispute.status)}`}>
                                        {dispute.status?.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-wide mb-1">Reason</p>
                                        <p className="text-gray-900 font-medium">{val(dispute.reason)}</p>
                                    </div>

                                    {dispute.resolution && (
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <p className="text-xs text-green-600 font-bold uppercase tracking-wide mb-1">Resolution</p>
                                            <p className="text-gray-900">{dispute.resolution}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Details Card */}
                            {order && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-brand-600" />
                                            Order Details
                                        </h3>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                            {order.order_number}
                                        </span>
                                    </div>

                                    <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-6">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Order Status</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-block w-2 h-2 rounded-full ${order.order_status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                                                <span className="text-sm font-medium capitalize">{val(order.order_status)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Fulfillment Status</p>
                                            <span className="text-sm font-medium capitalize">{val(order.fulfillment_status)}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize ${getStatusColor(order.payment_status)}`}>
                                                {val(order.payment_status)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Paid At</p>
                                            <p className="text-sm text-gray-900">{order.paid_at ? new Date(order.paid_at).toLocaleString() : 'Not Paid'}</p>
                                        </div>

                                        <div className="col-span-2 pt-4 border-t border-gray-100 mt-2">
                                            <div className="flex items-start gap-3">
                                                <Truck className="w-4 h-4 text-gray-400 mt-1" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Shipping Info</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-400">Courier</p>
                                                            <p className="text-sm font-medium">{val(order.courier_name)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Tracking Number</p>
                                                            <p className="text-sm font-mono bg-gray-50 inline-block px-1 rounded">{val(order.tracking_number)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: User & Financials (1 col) */}
                        <div className="space-y-6">

                            {/* User Profile Card */}
                            {user && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-brand-600" />
                                        Customer Profile
                                    </h3>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                            <img
                                                src={user.profile_photo || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                                            <p className="text-xs text-gray-500">User ID: {user.id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600 truncate" title={user.email}>{val(user.email)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-600">{val(user.phone_number)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Shield className="w-4 h-4 text-gray-400" />
                                            <span className={`capitalize ${user.user_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {val(user.user_status)} Account
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Financials Card */}
                            {order && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-brand-600" />
                                        Financial Context
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Total Order Amount</span>
                                            <span className="font-bold text-gray-900">{formatCurrency(order.total_amount, order.currency)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">Platform Commission</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(order.total_commission, order.currency)}</span>
                                        </div>
                                        <div className="pt-2 border-t border-dashed border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-green-700">Seller Earnings</span>
                                                <span className="text-lg font-bold text-green-700">{formatCurrency(order.total_seller_earnings, order.currency)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions (If Open) */}
                            {dispute.status === 'open' && onResolve && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <button
                                        onClick={() => onResolve(dispute)}
                                        className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
                                    >
                                        Resolve Dispute
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeDetailsModal;