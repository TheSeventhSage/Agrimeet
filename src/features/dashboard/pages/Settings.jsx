import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Bell,
    Shield,
    Save,
    Camera,
    Eye,
    EyeOff
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Input from '../../../shared/components/Input';
import AvatarUpload from '../../../shared/components/AvatarUpload';
import Textarea from '../../../shared/components/Textarea';
import Button from '../../../shared/components/Button';
import { showSuccess, showError } from '../../../shared/utils/alert';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("https://via.placeholder.com/100x100/10b981/ffffff?text=JD");

    useEffect(() => {
        return () => {
            const placeholder =
                "https://via.placeholder.com/100x100/10b981/ffffff?text=JD";
            if (
                avatarPreviewUrl &&
                avatarPreviewUrl !== placeholder &&
                avatarPreviewUrl.startsWith("blob:")
            ) {
                try {
                    URL.revokeObjectURL(avatarPreviewUrl);
                } catch (e) {
                    console.error("Failed to revoke avatar blob URL", e);
                }
            }
        };
    }, [avatarPreviewUrl]);

    // Profile form data
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@agrimeet.com',
        phone: '+1 (555) 123-4567',
        location: 'Lagos, Nigeria',
        bio: 'Passionate farmer and agricultural entrepreneur with over 5 years of experience in sustainable farming practices.',
        website: 'https://johndoe-farms.com',
        specialties: ['Organic Farming', 'Sustainable Agriculture', 'Crop Management']
    });

    // Password form data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        productUpdates: true,
        marketingEmails: false,
        securityAlerts: true
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Build FormData to send to server (multipart)
            const formData = new FormData();
            formData.append('firstName', profileData.firstName);
            formData.append('lastName', profileData.lastName);
            formData.append('email', profileData.email);
            formData.append('phone', profileData.phone);
            formData.append('location', profileData.location);
            formData.append('bio', profileData.bio || '');
            formData.append('website', profileData.website || '');
            // append avatar if selected
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            // Example: use your API client to send multipart request:
            // await api.patch('/api/seller/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

            // For now keep your simulated API call to preserve existing behavior:
            await new Promise(resolve => setTimeout(resolve, 1000));

            showSuccess('Profile updated successfully!');
        } catch (error) {
            showError('Failed to update profile. Please try again.');
            console.error('Profile update error:', error);
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
            // Simulate API call
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

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Settings updated successfully!');
        } catch (error) {
            showError('Failed to update settings. Please try again.');
            console.error('Settings update error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderProfileTab = () => (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Section */}
            <AvatarUpload
                src={avatarPreviewUrl}
                onFileSelected={(file, previewUrl) => {
                    // AvatarUpload might send only file or (file, previewUrl).
                    // Prefer previewUrl if provided, else create a blob URL here.
                    if (previewUrl) {
                        setAvatarPreviewUrl(previewUrl);
                    } else if (file) {
                        const url = URL.createObjectURL(file);
                        setAvatarPreviewUrl(url);
                        // If you create a blob URL here, you may want to revoke on unmount:
                        // We'll handle cleanup in useEffect below.
                    }

                    setAvatarFile(file);

                    // if you need the same format as DocumentUpload:
                    const fileObject = {
                        id: Math.random().toString(36).substr(2, 9),
                        file,
                        name: file?.name,
                        size: file?.size,
                        type: file?.type
                    };
                    console.log('avatar selected', fileObject);
                }}
            />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                />
                <Input
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                />
                <Input
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                />
                <Input
                    label="Location"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                />
                <Input
                    label="Website"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                />
            </div>

            <Textarea
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                rows={4}
                placeholder="Tell us about yourself and your farming experience..."
            />

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
                    onChange={handlePasswordChange}
                    required
                />
                <Input
                    label="New Password"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
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

    const renderNotificationsTab = () => (
        <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                            <p className="font-medium text-gray-900">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-600">
                                {key === 'emailNotifications' && 'Receive notifications via email'}
                                {key === 'smsNotifications' && 'Receive notifications via SMS'}
                                {key === 'orderUpdates' && 'Get notified about order status changes'}
                                {key === 'productUpdates' && 'Get notified about product updates'}
                                {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                                {key === 'securityAlerts' && 'Get notified about security-related activities'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name={key}
                                checked={value}
                                onChange={handleNotificationChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    loading={isSubmitting}
                    className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Settings
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
                    <div className="lg:w-64 flex-shrink-0">
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
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                            {activeTab === 'notifications' && renderNotificationsTab()}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
