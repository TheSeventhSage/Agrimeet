import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Shield,
    Edit,
    Camera,
    Briefcase,
    Building2,
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { storageManager } from '../../../shared/utils/storageManager';
import Button from '../../../shared/components/Button';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return dateString;
    }
};

const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const StatusBadge = ({ status }) => {
    const config = {
        Approved: 'bg-green-100 text-green-700',
        Pending: 'bg-yellow-100 text-yellow-700',
        Rejected: 'bg-red-100 text-red-700',
        'Not Submitted': 'bg-gray-100 text-gray-700',
    };
    const className = config[status] || config['Not Submitted'];
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>
            {status}
        </span>
    );
};

const ViewProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        location: 'Location not set',
        verifiedDate: '',
        storeName: '',
        status: '',
        avatar: null,
        initials: '',
        bio: '',
        businessType: '',
        businessDescription: '',
        gender: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const responseData = storageManager.getUserData();
        // Target the nested "data" property from your API response
        const user = responseData?.data || responseData;
        if (!user) return;

        const seller = user.seller;
        const kycData = seller?.latest_kyc;

        const kycStatus = kycData?.status
            ? kycData.status.charAt(0).toUpperCase() + kycData.status.slice(1)
            : 'Not Submitted';

        setUserData({
            name: `${user.first_name || ''} ${user.last_name || ''}`,
            email: user.email,
            phone: user.phone_number,
            location: seller?.address || (seller?.city && seller?.state ? `${seller.city}, ${seller.state}` : 'Location not set'),
            verifiedDate: kycData?.verified_at,
            storeName: seller?.store_name || 'Individual Seller',
            status: kycStatus,
            avatar: user.profile_photo,
            initials: getInitials(user.first_name, user.last_name),
            bio: seller?.business_bio || 'No business biography provided.',
            businessType: seller?.business_type?.name || 'Not Specified',
            businessDescription: seller?.business_type?.description || '',
            gender: seller?.gender || 'Not specified'
        });
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                        <div className="relative mb-4 md:mb-0 md:mr-6">
                            {userData.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-brand-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-100">
                                    {userData.initials}
                                </div>
                            )}
                            <Button variant="icon" className="absolute bottom-1 right-1 bg-white border rounded-full p-2 hover:bg-gray-100">
                                <Camera className="w-4 h-4 text-gray-700" />
                            </Button>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                                    <p className="text-gray-600 text-lg mt-1">{userData.storeName}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <StatusBadge status={userData.status} />
                                        <span className="text-sm text-gray-500 capitalize">• {userData.gender}</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="mt-4 md:mt-0" onClick={() => navigate('/settings')}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact & Business Basics */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{userData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{userData.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">
                                        Verified: {userData.verifiedDate ? formatDate(userData.verifiedDate) : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-2">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-brand-600" />
                                    Business Type
                                </h3>
                                <p className="font-medium text-gray-800">{userData.businessType}</p>
                                <p className="text-sm text-gray-500 mt-1 italic">{userData.businessDescription}</p>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-brand-600" />
                                    Business Bio
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                    {userData.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewProfile;