import { useState, useEffect } from 'react';
import {
    User,
    Lock,
    Bell,
    Save,
    Eye,
    EyeOff
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Input from '../../../shared/components/Input';
import AvatarUpload from '../../../shared/components/AvatarUpload';
import Button from '../../../shared/components/Button';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../pages/utils/storageManager';
import { updateUserProfile } from '../../../pages/api/profile.api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
    const [currentUserData, setCurrentUserData] = useState(null);

    useEffect(() => {
        return () => {
            if (avatarPreviewUrl && avatarPreviewUrl.startsWith && avatarPreviewUrl.startsWith("blob:")) {
                try {
                    URL.revokeObjectURL(avatarPreviewUrl);
                } catch (e) {
                    console.error("Failed to revoke avatar blob URL", e);
                }
            }
        };
    }, [avatarPreviewUrl]);

    // Profile form data (controlled inputs)
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        // Load user data from storage manager
        const userData = storageManager.getUserData();

        if (userData && userData.data) {
            setCurrentUserData(userData.data);

            setProfileData(prev => ({
                ...prev,
                firstName: userData.data.first_name || '',
                lastName: userData.data.last_name || '',
                email: userData.data.email || '',
                phone: userData.data.phone_number || ''
            }));

            // Set avatar if available in user data
            if (userData.data.profile_photo) {
                setAvatarPreviewUrl(userData.data.profile_photo);
            } else if (userData.avatar_url) {
                setAvatarPreviewUrl(userData.avatar_url);
            }
        }
    }, []);

    // Password form data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    /**
     * Robust handler for profile inputs.
     * Accepts either:
     *  - (event) where event.target.name and event.target.value exist
     *  - (name, valueOrEvent) where valueOrEvent can be an event or a raw string
     *
     * Many custom Input components call onChange(value) instead of onChange(event).
     * To support both, prefer calling: onChange={(v)=>handleProfileChange('firstName', v)}
     * but this handler is defensive so passing the raw event also works.
     */
    const handleProfileChange = (eOrName, maybeValue) => {
        let name, value;

        // Called as handleProfileChange('firstName', valueOrEvent)
        if (typeof eOrName === 'string') {
            name = eOrName;
            const v = maybeValue;
            if (v && v.target) {
                value = v.target.value;
            } else {
                value = v;
            }
        } else if (eOrName && eOrName.target) {
            // Called as handleProfileChange(event)
            name = eOrName.target.name;
            value = eOrName.target.value;
        } else {
            // Unexpected call signature, do nothing
            return;
        }

        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));

        console.log('Profile data updated:', profileData);
    };

    /**
     * Robust handler for password inputs similar to profile handler.
     */
    const handlePasswordChange = (eOrName, maybeValue) => {
        let name, value;

        if (typeof eOrName === 'string') {
            name = eOrName;
            const v = maybeValue;
            if (v && v.target) {
                value = v.target.value;
            } else {
                value = v;
            }
        } else if (eOrName && eOrName.target) {
            name = eOrName.target.name;
            value = eOrName.target.value;
        } else {
            return;
        }

        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Get current user data for merging
            const userData = storageManager.getUserData();
            if (!userData || !userData.data) {
                throw new Error('User data not found');
            }

            const seller = userData.data.seller;

            // Create FormData for multipart request
            const formData = new FormData();
            formData.append('name', profileData.firstName + ' ' + profileData.lastName);
            // formData.append('last_name', profileData.lastName);
            formData.append('email', profileData.email);
            formData.append('phone_number', profileData.phone);

            // if (avatarFile) {
            // }
            formData.append('profile_photo', avatarFile);
            formData.append('country_name', 'Nigeria');

            formData.append('business_type_id', seller.business_type_id);
            formData.append('company', seller.store_name),
                formData.append('address', seller.address),
                formData.append('state', seller.state),
                formData.append('city', seller.city),
                formData.append('business_bio', seller.business_bio),
                formData.append('bank_name', seller.bank_name),
                formData.append('bank_account_number', seller.bank_account_number),
                formData.append('business_phone_number', seller.business_phone_number),
                formData.append('name_on_account', seller.name_on_account),

                // Add seller as JSON string (backend should parse JSON) — safe fallback
                // if (seller) {
                //     formData.append('seller', JSON.stringify({
                //         business_type_id: seller.business_type_id,
                //         store_name: seller.store_name,
                //         address: seller.address,
                //         city: seller.city,
                //         state: seller.state,
                //         business_bio: seller.business_bio,
                //         bank_name: seller.bank_name,
                //         bank_account_number: seller.bank_account_number,
                //         business_phone_number: seller.business_phone_number,
                //         name_on_account: seller.name_on_account,
                //         gender: seller.gender
                //     }));
                // }

                // DEBUG: Log what we're sending (formData)
                // Note: Iterating FormData is safe in modern browsers
                console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Call the API with the FormData (multipart request)
            const response = await updateUserProfile(userData.data.id, formData);

            // Update local storage with the new data (merge)
            const updatedUserData = {
                ...userData,
                data: {
                    ...userData.data,
                    first_name: profileData.firstName,
                    last_name: profileData.lastName,
                    email: profileData.email,
                    phone_number: profileData.phone,
                    profile_photo: (response?.data && (response.data.profile_photo || response.data.user?.profile_photo)) || userData.data.profile_photo,
                    // keep seller object (could be updated from backend if returned)
                    seller: response?.data?.seller || userData.data.seller
                }
            };

            storageManager.setUserData(updatedUserData);

            // Update avatar preview if we have a new photo URL
            if (response?.data?.profile_photo || response?.data?.user?.profile_photo) {
                const newPhoto = response.data.profile_photo || response.data.user?.profile_photo;
                setAvatarPreviewUrl(newPhoto);
            }

            showSuccess('Profile updated successfully!');

        } catch (error) {
            console.error('Profile update error:', error);
            showError((error && error.message) ? error.message : 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError('New passwords do not match.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call (replace with real call)
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showError('Failed to update password. Please try again.');
            console.error('Password update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarSelected = (file, previewUrl) => {
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreviewUrl(previewUrl);
        console.log('Avatar selected:', file.name, 'Preview URL:', previewUrl);
    };

    const renderProfileTab = () => (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Section */}
            <AvatarUpload
                src={avatarPreviewUrl}
                onFileSelected={handleAvatarSelected}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* IMPORTANT:
                    Many custom Input components call onChange(value) instead of onChange(event).
                    To be safe we pass a wrapper that always supplies the field name as first arg.
                */}
                <Input
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={(v) => handleProfileChange('firstName', v)}
                    required
                />
                <Input
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={(v) => handleProfileChange('lastName', v)}
                    required
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={(v) => handleProfileChange('email', v)}
                    required
                />
                <Input
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={(v) => handleProfileChange('phone', v)}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    loading={isSubmitting}
                    className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>
        </form>
    );

    const renderSecurityTab = () => (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(v) => handlePasswordChange('currentPassword', v)}
                    required
                />
                <Input
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(v) => handlePasswordChange('newPassword', v)}
                    required
                />
                <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(v) => handlePasswordChange('confirmPassword', v)}
                    required
                />
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPassword ? 'Hide' : 'Show'} passwords
                </button>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    loading={isSubmitting}
                    className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Update Password
                </Button>
            </div>
        </form>
    );

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="lg:w-64 shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-brand-100 text-brand-700 border border-brand-200'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
