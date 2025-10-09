import React from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Star,
    Edit,
    Camera
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const ViewProfile = () => {
    // Mock user data
    const userData = {
        name: 'John Doe',
        email: 'john.doe@agrimeet.com',
        phone: '+1 (555) 123-4567',
        location: 'Lagos, Nigeria',
        joinDate: 'January 15, 2023',
        role: 'Seller',
        status: 'Verified',
        avatar: 'https://via.placeholder.com/150x150/10b981/ffffff?text=JD',
        rating: 4.8,
        totalReviews: 156,
        totalSales: 234,
        totalProducts: 24,
        bio: 'Passionate farmer and agricultural entrepreneur with over 5 years of experience in sustainable farming practices. Specializing in organic vegetables and grains.',
        specialties: ['Organic Farming', 'Sustainable Agriculture', 'Crop Management', 'Soil Health'],
        achievements: [
            'Top Seller - Q3 2023',
            'Quality Excellence Award',
            'Customer Choice Award',
            'Sustainability Champion'
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Suspended':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                        <p className="text-gray-600 mt-2">View and manage your profile information</p>
                    </div>
                    <button
                        onClick={() => window.location.hash = '/settings'}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-32 bg-linear-to-r from-brand-500 to-brand-600 relative">
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-6 pb-6 -mt-16 relative">
                        <div className="flex items-start justify-between">
                            <div className="flex items-end gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={userData.avatar}
                                        alt={userData.name}
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                                    />
                                    <button className="absolute -bottom-1 -right-1 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors">
                                        <Camera className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Basic Info */}
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                                    <p className="text-gray-600">{userData.role}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userData.status)}`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {userData.status}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium text-gray-700">{userData.rating}</span>
                                            <span className="text-sm text-gray-500">({userData.totalReviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{userData.totalSales}</p>
                                <p className="text-sm text-gray-600">Total Sales</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{userData.totalProducts}</p>
                                <p className="text-sm text-gray-600">Products</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{userData.totalReviews}</p>
                                <p className="text-sm text-gray-600">Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium text-gray-900">{userData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium text-gray-900">{userData.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="font-medium text-gray-900">{userData.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">Member Since</p>
                                    <p className="font-medium text-gray-900">{userData.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">{userData.bio}</p>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                                {userData.specialties.map((specialty, index) => (
                                    <span key={index} className="px-3 py-1 bg-brand-100 text-brand-800 text-sm rounded-full">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {userData.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Star className="w-4 h-4 text-yellow-600" />
                                </div>
                                <span className="font-medium text-gray-900">{achievement}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewProfile;



