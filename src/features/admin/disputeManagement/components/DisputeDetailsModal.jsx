import { useState } from 'react';
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
    Shield,
    Phone,
    Mail,
    Copy,
    Wallet,
    Scale,
    Activity,
    ArrowRight,
    MapPin
} from 'lucide-react';
import { showSuccess } from '../../../../shared/utils/alert'; // Assuming you have this

const DisputeDetailsModal = ({ dispute, onClose, onResolve }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!dispute) return null;

    const { order, user } = dispute;

    // --- Helpers ---
    const formatCurrency = (amount, currency = 'NGN') => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency || 'NGN'
        }).format(parseFloat(amount || 0));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-NG', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        showSuccess(`${label} copied to clipboard`);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'settled': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    // --- Sub-Components ---
    const DetailRow = ({ label, value, subValue, icon: Icon, copyable }) => (
        <div className="flex flex-col items-start justify-between gap-2.5 py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 px-2 hover:rounded-lg transition-colors space-y-2">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5" />}
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                </div>
            </div>
            <div className="text-right flex items-center gap-2 ml-4">
                <span className="font-medium text-gray-900 text-sm">{value || <span className="italic text-gray-300">N/A</span>}</span>
                {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
                {copyable && value && (
                    <button
                        onClick={() => copyToClipboard(value, label)}
                        className="text-gray-300 hover:text-brand-600 transition-colors"
                        title="Copy"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );

    // --- Tab Content Renderers ---

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Resolution/Status Box */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-brand-600" />
                        Dispute Status
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(dispute.status)}`}>
                        {dispute.status?.toUpperCase()}
                    </span>
                </div>
                <div className="p-4 space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="text-xs text-red-500 font-bold uppercase tracking-wide mb-1">Customer Reason</p>
                        <p className="text-gray-900 font-medium">{dispute.reason}</p>
                    </div>
                    {dispute.resolution && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <p className="text-xs text-green-600 font-bold uppercase tracking-wide mb-1">Admin Resolution</p>
                            <p className="text-gray-900">{dispute.resolution}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600" />
                    Timeline Events
                </h3>
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                    {/* Order Created */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Order Placed</p>
                        <p className="text-sm font-medium">{formatDate(order?.created_at)}</p>
                    </div>

                    {/* Paid */}
                    {order?.paid_at && (
                        <div className="relative pl-6">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Payment Confirmed</p>
                            <p className="text-sm font-medium">{formatDate(order.paid_at)}</p>
                        </div>
                    )}

                    {/* Dispute Created */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Dispute Opened</p>
                        <p className="text-sm font-medium">{formatDate(dispute.created_at)}</p>
                    </div>

                    {/* Last Updated */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-400 rounded-full border-4 border-white shadow-sm"></div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Last Updated</p>
                        <p className="text-sm font-medium">{formatDate(dispute.updated_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrderDetails = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Order Information</h3>
                    <DetailRow label="Order Number" value={order?.order_number} copyable icon={Package} />
                    <DetailRow label="Order Status" value={order?.order_status} icon={CheckCircle} />
                    <DetailRow label="Fulfillment" value={order?.fulfillment_status} icon={Truck} />
                    <DetailRow label="Payment Status" value={order?.payment_status} icon={CreditCard} />
                    <DetailRow label="Order Date" value={formatDate(order?.created_at)} icon={Calendar} />
                </div>

                {/* Shipping & Logistics */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Logistics</h3>
                    <DetailRow label="Tracking Number" value={order?.tracking_number} copyable icon={MapPin} />
                    <DetailRow label="Courier" value={order?.courier_name} icon={Truck} />
                    <DetailRow label="Total Weight" value={`${order?.total_weight || '0.00'} kg`} icon={Scale} />
                    <DetailRow label="Delivery Address ID" value={`#${order?.delivery_address_id}`} icon={MapPin} />
                    <DetailRow label="Delivered At" value={order?.delivered_at ? formatDate(order.delivered_at) : 'Not Delivered'} icon={Clock} />
                </div>
            </div>
        </div>
    );

    const renderFinancials = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-600" />
                        Financial Breakdown
                    </h3>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Customer Pays */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Paid</h4>
                            <div className="flex flex-col gap-2.5 justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-600">Items Total</span>
                                <span className="font-medium">{formatCurrency(order?.total_amount, order?.currency)}</span>
                            </div>
                            <div className="flex flex-col gap-2.5 justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-600">Shipping Fees</span>
                                <span className="font-medium">{formatCurrency(order?.shipping_amount, order?.currency)}</span>
                            </div>
                            <div className="flex flex-col gap-2.5 justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-600">Delivery Charge</span>
                                <span className="font-medium">{formatCurrency(order?.delivery_charge, order?.currency)}</span>
                            </div>
                            <div className="flex flex-col gap-2.5 justify-between py-2 pt-4">
                                <span className="font-bold text-gray-900">Total Paid</span>
                                <span className="font-bold text-xl text-brand-600">{formatCurrency(Number(order?.total_amount) + Number(order?.shipping_amount), order?.currency)}</span>
                            </div>
                        </div>

                        {/* Seller Receives */}
                        <div className="space-y-3 relative md:pl-8 md:border-l border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Seller Net</h4>
                            <div className="flex flex-col gap-2.5 justify-between py-2 border-b border-gray-50">
                                <span className="text-gray-600">Gross Sales</span>
                                <span className="font-medium">{formatCurrency(order?.total_amount, order?.currency)}</span>
                            </div>
                            <div className="flex flex-col gap-2.5 justify-between py-2 border-b border-gray-50 text-red-500">
                                <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Platform Commission</span>
                                <span className="font-medium">-{formatCurrency(order?.total_commission, order?.currency)}</span>
                            </div>
                            <div className="flex flex-col gap-2.5 justify-between py-2 pt-4">
                                <span className="font-bold text-gray-900">Seller Earnings</span>
                                <span className="font-bold text-xl text-green-600">{formatCurrency(order?.total_seller_earnings, order?.currency)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCustomer = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6 items-start">
                {/* Avatar Section */}
                <div className="flex-shrink-0  text-center md:text-left">
                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg mx-auto md:mx-0">
                        <img
                            src={user?.profile_photo || `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-3">
                        <p className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${user?.user_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user?.user_status?.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div className="col-span-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h3>
                        <p className="text-sm text-gray-500">User ID: #{user?.id}</p>
                    </div>

                    <DetailRow label="Email Address" value={user?.email} icon={Mail} copyable />
                    <DetailRow label="Phone Number" value={user?.phone_number} icon={Phone} copyable />
                    <DetailRow
                        label="Email Verified"
                        value={user?.email_verified_at ? 'Verified' : 'Unverified'}
                        icon={Shield}
                        subValue={user?.email_verified_at ? formatDate(user.email_verified_at) : null}
                    />
                    <DetailRow label="Member Since" value={formatDate(user?.created_at)} icon={Calendar} />

                    {/* Wallet Section */}
                    <div className="col-span-2 mt-4 bg-brand-50 rounded-xl p-4 flex justify-between items-center border border-brand-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg text-brand-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-brand-900">Wallet Balance</p>
                                <p className="text-xs text-brand-600">Available for withdrawal</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-brand-700">
                            {formatCurrency(user?.wallet, order?.currency)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 p-2 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto md:p-4">
            <div className="bg-gray-50 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Dispute #{dispute.id}</h2>
                            <p className="text-xs text-gray-500">
                                Order: <span className="font-mono text-gray-700">{order?.order_number}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex overflow-hidden">

                    {/* Sidebar Tabs (Desktop) / Top Tabs (Mobile) */}
                    <div className="w-full sm:w-64 bg-white border-r border-gray-200 flex flex-row sm:flex-col overflow-x-auto md:overflow-visible">
                        {[
                            { id: 'overview', label: 'Overview', icon: FileText },
                            { id: 'order', label: 'Order & Logistics', icon: Package },
                            { id: 'financials', label: 'Financials', icon: CreditCard },
                            { id: 'customer', label: 'Customer Profile', icon: User },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b md:border-b-0 md:border-l-4 transition-all whitespace-nowrap
                                    ${activeTab === tab.id
                                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-600' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'order' && renderOrderDetails()}
                        {activeTab === 'financials' && renderFinancials()}
                        {activeTab === 'customer' && renderCustomer()}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Close View
                    </button>
                    {dispute.status === 'open' && onResolve && (
                        <button
                            onClick={() => onResolve(dispute)}
                            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            Take Action <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisputeDetailsModal;