// admin/components/UserManagement/UserDetailsModal.jsx
import {
    XCircle, CheckCircle, Clock, AlertCircle,
    Mail, Phone, MapPin, Building, Calendar,
    Shield, CreditCard, Package, ShoppingCart,
    Ban, User, Globe
} from 'lucide-react';

const UserDetailsModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
            suspended: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Suspended' },
            banned: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Banned' },
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
            inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Inactive' }
        };

        const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const getRoleBadge = (roles) => {
        const roleColors = {
            admin: 'bg-purple-100 text-purple-800',
            seller: 'bg-blue-100 text-blue-800',
            buyer: 'bg-green-100 text-green-800',
            user: 'bg-gray-100 text-gray-800'
        };

        const primaryRole = Array.isArray(roles) ? roles[0] : roles;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[primaryRole] || roleColors.user}`}>
                {primaryRole}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,.7)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Profile Section */}
                    <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            {user.profile_photo ? (
                                <img
                                    src={user.profile_photo}
                                    alt={user.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-3xl font-bold text-white">
                                        {user.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </p>
                                {user.phone_number && (
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4" />
                                        {user.phone_number}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    {getStatusBadge(user.user_status || 'active')}
                                    {getRoleBadge(user.roles || 'buyer')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-600" />
                            Account Information
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">User ID</label>
                                <p className="text-gray-900 font-mono">{user.id}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email Verified</label>
                                <p className="text-gray-900">
                                    {user.email_verified_at ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            Verified on {formatDate(user.email_verified_at)}
                                        </span>
                                    ) : (
                                        <span className="text-red-600 flex items-center gap-1">
                                            <XCircle className="w-4 h-4" />
                                            Not Verified
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">First Name</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    {user.first_name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Name</label>
                                <p className="text-gray-900 flex items-center gap-1">   
                                    {user.last_name}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Name</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    {user.user_account_name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                <p className="text-gray-900 flex items-center gap-1">   
                                    {user.user_bank_name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Number</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    {user.user_account_number || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                <p className="text-gray-900 flex items-center gap-1">   
                                    {user.user_bank_name || 'N/A'}
                                </p>
                            </div>
                            {/* <div>
                                <label className="text-sm font-medium text-gray-600">Joined Date</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {formatDate(user.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {formatDateTime(user.updated_at)}
                                </p>
                            </div> */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">Suspension Count</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    <Ban className={`w-4 h-4 ${user.suspension_count > 0 ? 'text-red-500' : 'text-gray-400'}`} />
                                    <span className={user.suspension_count > 0 ? 'text-red-600 font-semibold' : ''}>
                                        {user.suspension_count || 0} {user.suspension_count === 1 ? 'time' : 'times'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Suspension Reason</label>
                                <p className="text-gray-900 flex items-center gap-1">
                                    {user.suspension_reason || 'N/A'}
                                </p>
                            </div>
                            {user.last_login_at && (
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Last Login</label>
                                    <p className="text-gray-900">{formatDateTime(user.last_login_at)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Information */}
                    {(user.country_name || user.state || user.city || user.address) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-600" />
                                Location Information
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                {user.country_name && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Globe className="w-4 h-4" />
                                            Country
                                        </label>
                                        <p className="text-gray-900">{user.country_name}</p>
                                    </div>
                                )}
                                {user.state && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">State/Province</label>
                                        <p className="text-gray-900">{user.state}</p>
                                    </div>
                                )}
                                {user.city && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">City</label>
                                        <p className="text-gray-900">{user.city}</p>
                                    </div>
                                )}
                                {user.postal_code && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Postal Code</label>
                                        <p className="text-gray-900">{user.postal_code}</p>
                                    </div>
                                )}
                            </div>
                            {user.address && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-600">Full Address</label>
                                    <p className="text-gray-900">{user.address}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Company Information */}
                    {user.company && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-brand-600" />
                                Company Information
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Company Name</label>
                                    <p className="text-gray-900">{user.company}</p>
                                </div>
                                {user.job_title && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Job Title</label>
                                        <p className="text-gray-900">{user.job_title}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Activity Stats */}
                    {(user.orders_count !== undefined || user.total_spent !== undefined) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-brand-600" />
                                Activity Statistics
                            </h5>
                            <div className="grid grid-cols-3 gap-4">
                                {user.orders_count !== undefined && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <label className="text-sm font-medium text-blue-600">Total Orders</label>
                                        <p className="text-2xl font-bold text-blue-900">{user.orders_count}</p>
                                    </div>
                                )}
                                {user.total_spent !== undefined && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <label className="text-sm font-medium text-green-600">Total Spent</label>
                                        <p className="text-2xl font-bold text-green-900">${user.total_spent?.toLocaleString()}</p>
                                    </div>
                                )}
                                {user.products_count !== undefined && (
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <label className="text-sm font-medium text-purple-600">Products Listed</label>
                                        <p className="text-2xl font-bold text-purple-900">{user.products_count}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Seller Information */}
                    {user.seller && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-brand-600" />
                                Seller Information
                            </h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Store Name</label>
                                    <p className="text-gray-900 font-semibold">{user.seller.store_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Business Phone</label>
                                    <p className="text-gray-900">{user.seller.business_phone_number || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">KYC Status</label>
                                    <p className="text-gray-900">
                                        {user.seller.kyc_verified_at ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <Shield className="w-4 h-4" />
                                                Verified on {formatDate(user.seller.kyc_verified_at)}
                                            </span>
                                        ) : (
                                            <span className="text-yellow-600 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Pending Verification
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {user.seller.store_rating && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Store Rating</label>
                                        <p className="text-gray-900 font-semibold">
                                            ⭐ {user.seller.store_rating} / 5.0
                                        </p>
                                    </div>
                                )}
                            </div>
                            {user.seller.business_bio && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium text-gray-600">Business Bio</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg mt-1">{user.seller.business_bio}</p>
                                </div>
                            )}

                            {/* Bank Details */}
                            {(user.seller.bank_name || user.seller.bank_account_number) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h6 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-brand-600" />
                                        Banking Information
                                    </h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                            <p className="text-gray-900">{user.seller.bank_name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Account Number</label>
                                            <p className="text-gray-900 font-mono">
                                                {user.seller.bank_account_number
                                                    ? `****${user.seller.bank_account_number.slice(-4)}`
                                                    : 'N/A'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Suspension History */}
                    {user.suspension_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h5 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                Suspension Information
                            </h5>
                            <div>
                                <label className="text-sm font-medium text-red-700">Last Suspension Reason</label>
                                <p className="text-red-900 bg-white p-3 rounded-lg mt-1">{user.suspension_reason}</p>
                            </div>
                            {user.suspended_at && (
                                <div className="mt-3">
                                    <label className="text-sm font-medium text-red-700">Suspended On</label>
                                    <p className="text-red-900">{formatDateTime(user.suspended_at)}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;