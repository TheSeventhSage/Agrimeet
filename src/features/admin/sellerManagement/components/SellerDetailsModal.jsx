// admin/components/sellers/SellerDetailsModal.jsx
import {
    X,
    Store,
    User,
    MapPin,
    Phone,
    Mail,
    Building,
    CreditCard,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    UserX,
    UserCheck
} from 'lucide-react';
import KYCSection from '../pages/KYCSection';

const SellerDetailsModal = ({ seller, onClose, onSuspendSeller, onUnsuspendSeller }) => {
    if (!seller) return null;

    const user = seller.user;
    const isSuspended = user?.user_status === 'suspended' || user?.user_status === 'banned';
    const suspensionCount = user?.suspension_count || 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Seller Details</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Seller ID: {seller.id} | User ID: {user?.id}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* User Status Banner */}
                    <div className={`p-4 rounded-lg ${isSuspended
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-green-50 border border-green-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isSuspended ? (
                                    <>
                                        <XCircle className="w-6 h-6 text-red-600" />
                                        <div>
                                            <p className="font-medium text-red-900">Account Suspended</p>
                                            <p className="text-sm text-red-700">
                                                This seller's account is currently suspended
                                            </p>
                                            {suspensionCount > 0 && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    Suspended {suspensionCount} {suspensionCount === 1 ? 'time' : 'times'}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">Account Active</p>
                                            <p className="text-sm text-green-700">This seller's account is active</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                {isSuspended ? (
                                    <button
                                        onClick={() => onUnsuspendSeller(seller)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <UserCheck className="w-4 h-4" />
                                        Unsuspend Seller
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onSuspendSeller(seller)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <UserX className="w-4 h-4" />
                                        Suspend Seller
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-brand-600" />
                            User Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Full Name</label>
                                <p className="text-gray-900">
                                    {user ? `${user.first_name} ${user.last_name}` : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                <p className="text-gray-900">{user?.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Roles</label>
                                <div className="flex gap-2 mt-1">
                                    {user?.roles?.map((role, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Wallet Balance</label>
                                <p className="text-gray-900">₦{parseFloat(user?.wallet || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Status</label>
                                <p className="text-gray-900 capitalize">{user?.user_status || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Store Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Store className="w-5 h-5 text-brand-600" />
                            Store Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Store Name</label>
                                <p className="text-gray-900">{seller.store_name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Business Type</label>
                                <p className="text-gray-900">{seller.business_type?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Gender</label>
                                <p className="text-gray-900 capitalize">{seller.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Business Phone</label>
                                <p className="text-gray-900">{seller.business_phone_number || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-600">Business Bio</label>
                                <p className="text-gray-900">{seller.business_bio || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-brand-600" />
                            Location
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <p className="text-gray-900">{seller.address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">City</label>
                                <p className="text-gray-900">{seller.city || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">State</label>
                                <p className="text-gray-900">{seller.state || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-brand-600" />
                            Bank Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Bank Name</label>
                                <p className="text-gray-900">{seller.bank_name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Account Number</label>
                                <p className="text-gray-900">{seller.bank_account_number || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-600">Account Name</label>
                                <p className="text-gray-900">{seller.name_on_account || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* KYC Information */}
                    <div>
                        <KYCSection seller={seller} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDetailsModal;