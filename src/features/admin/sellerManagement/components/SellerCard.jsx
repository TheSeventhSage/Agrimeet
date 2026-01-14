// admin/components/sellers/SellerCard.jsx
import {
    Store,
    User,
    MapPin,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Building,
    AlertCircle,
    UserX,
    UserCheck,
    ShieldCheck
} from 'lucide-react';

const SellerCard = ({ seller, onViewDetails, onSuspendSeller, onUnsuspendSeller, onReviewKYC }) => {
    const getKycStatusBadge = () => {
        // Check latest_kyc status
        if (seller.latest_kyc) {
            const status = seller.latest_kyc.status;

            if (status === 'approved') {
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        KYC Approved
                    </span>
                );
            } else if (status === 'pending') {
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3" />
                        KYC Pending
                    </span>
                );
            } else if (status === 'rejected') {
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        KYC Rejected
                    </span>
                );
            }
        }

        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <AlertCircle className="w-3 h-3" />
                No KYC
            </span>
        );
    };

    const getUserStatusBadge = () => {
        const status = seller.user?.user_status || 'active';

        if (status === 'suspended' || status === 'banned') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3" />
                    Suspended
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3" />
                Active
            </span>
        );
    };

    const isSuspended = seller.user?.user_status === 'suspended' || seller.user?.user_status === 'banned';
    const suspensionCount = seller.user?.suspension_count || 0;
    const isKycPending = seller.latest_kyc?.status === 'pending';

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                        {seller.user?.profile_photo ? (
                            <img
                                src={seller.user.profile_photo}
                                alt={seller.store_name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <Store className="w-6 h-6 text-brand-700" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {seller.store_name || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {seller.user ? `${seller.user.first_name} ${seller.user.last_name}` : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    {getKycStatusBadge()}
                    {getUserStatusBadge()}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{seller.business_type?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{seller.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                        {seller.city && seller.state
                            ? `${seller.city}, ${seller.state}`
                            : seller.address || 'N/A'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{seller.business_phone_number || seller.user?.phone_number || 'N/A'}</span>
                </div>
            </div>

            {/* Suspension Count Warning */}
            {suspensionCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Suspended {suspensionCount} {suspensionCount === 1 ? 'time' : 'times'}
                    </p>
                </div>
            )}

            {/* Bank Information */}
            {seller.bank_name && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Bank Details</p>
                    <p className="text-sm font-medium text-gray-900">{seller.bank_name}</p>
                    <p className="text-sm text-gray-600">{seller.bank_account_number}</p>
                    <p className="text-xs text-gray-500">{seller.name_on_account}</p>
                </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-auto">
                <button
                    onClick={() => onViewDetails(seller)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    View Details
                </button>

                {isKycPending && (
                    <button
                        onClick={() => { console.log('Seller being reviewed:', seller); onReviewKYC(seller) }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                        title="Review KYC Documents"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Review
                    </button>
                )}

                {isSuspended ? (
                    <button
                        onClick={() => onUnsuspendSeller(seller)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Unsuspend Seller"
                    >
                        <UserCheck className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={() => onSuspendSeller(seller)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Suspend Seller"
                    >
                        <UserX className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SellerCard;