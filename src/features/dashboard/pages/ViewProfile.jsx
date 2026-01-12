import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Star,
    Edit,
    Camera,
    DollarSign,
    Package,
    Users,
    MessageSquare,
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { storageManager } from '../../../shared/utils/storageManager';
import Button from '../../../shared/components/Button'; // Assuming you have a Button

// Helper to format dates
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

// Helper to get initials
const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

// Helper for status badge
const StatusBadge = ({ status }) => {
    const config = {
        Verified: 'bg-green-100 text-green-700',
        Pending: 'bg-yellow-100 text-yellow-700',
        Rejected: 'bg-red-100 text-red-700',
        'Not Submitted': 'bg-gray-100 text-gray-700',
    };
    const className = config[status] || config['Not Submitted'];
    return (
        <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}
        >
            {status}
        </span>
    );
};

const ViewProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        verifiedDate: '',
        role: '',
        status: '',
        avatar: null,
        initials: '',
        bio: '',
        // --- Placeholders ---
        // These are not in the storageManager.getUser() object
        // You would need to load these from an analytics API (e.g., getVendorStats)
        rating: 4.8,
        totalReviews: 156,
        totalSales: 234,
        totalProducts: 24,
        specialties: ['Organic Farming', 'Sustainable Agriculture', 'Crop Management', 'Soil Health'],
        // --- End Placeholders ---
    });

    useEffect(() => {
        // Get user data from local storage
        const storedUserData = storageManager.getUserData();
        if (!storedUserData?.data) return;

        const user = storedUserData.data;
        const seller = storedUserData.data.seller;
        const kycData = seller?.latest_kyc;

        const kycStatus =
            kycData?.status === 'approved'
                ? 'Verified'
                : kycData?.status === 'pending'
                    ? 'Pending'
                    : kycData?.status === 'rejected'
                        ? 'Rejected'
                        : 'Not Submitted';

        setUserData((prev) => ({
            ...prev,
            name: `${user.first_name || ''} ${user.last_name || ''}`,
            email: user.email,
            phone: user.phone_number,
            location:
                seller?.city && seller?.state
                    ? `${seller.city}, ${seller.state}`
                    : 'Location not set',
            verifiedDate: kycData?.verified_at,
            role: seller?.store_name || 'Seller',
            status: kycStatus,
            avatar: user.profile_photo,
            initials: getInitials(user.first_name, user.last_name),
            bio: seller?.business_bio || seller?.business_type?.description || 'No business biography provided.',
        }));
    }, []);

    // Placeholder data for stats - not from user object
    const statsCards = [
        {
            icon: DollarSign,
            label: 'Total Sales',
            value: userData.totalSales,
            color: 'text-green-600',
        },
        {
            icon: Package,
            label: 'Total Products',
            value: userData.totalProducts,
            color: 'text-blue-600',
        },
        {
            icon: Users,
            label: 'Total Customers',
            value: userData.totalReviews, // Using reviews as proxy
            color: 'text-indigo-600',
        },
        {
            icon: Star,
            label: 'Rating',
            value: userData.rating,
            color: 'text-yellow-600',
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                        {/* Avatar */}
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
                            <Button
                                variant="icon"
                                className="absolute bottom-1 right-1 bg-white border rounded-full p-2 hover:bg-gray-100"
                            >
                                <Camera className="w-4 h-4 text-gray-700" />
                            </Button>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {userData.name}
                                    </h2>
                                    <p className="text-gray-600 text-lg mt-1">
                                        {userData.role}
                                    </p>
                                    <StatusBadge status={userData.status} />
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-4 md:mt-0"
                                // onClick={() => ...} // Add navigation to edit profile
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards (Using Placeholder Data) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl shadow-xs border border-gray-100 p-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile Details & Bio */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Details */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-800">
                                    {userData.email}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-800">
                                    {userData.phone}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-800">
                                    {userData.location}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-800">
                                    Verified On: {formatDate(userData.verifiedDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio & Specialties */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 lg:col-span-2">
                        {/* Bio */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Business Bio
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {userData.bio}
                            </p>
                        </div>

                        {/* Specialties (Using Placeholder Data) */}
                        {/* <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Specialties
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {userData.specialties.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-brand-100 text-brand-800 text-sm rounded-full"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewProfile;