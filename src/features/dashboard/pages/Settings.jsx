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
import DocumentUpload from '../../../shared/components/DocumentUpload';
import Button from '../../../shared/components/Button';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { storageManager } from '../../../shared/utils/storageManager';
import { updateUserProfile } from '../../../pages/api/profile.api';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Stores the raw File object
    const [avatarFile, setAvatarFile] = useState(null);

    // Stores the full complex user object
    const [currentUserData, setCurrentUserData] = useState(null);

    // Form data for the 4 editable fields
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
    });

    useEffect(() => {
        const userStored = storageManager.getUserData();
        if (userStored) {
            const actualUserData = userStored.data || userStored;
            setCurrentUserData(actualUserData);

            setProfile({
                first_name: actualUserData.first_name || '',
                last_name: actualUserData.last_name || '',
                email: actualUserData.email || '',
                phone_number: actualUserData.phone_number || '',
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDocumentChange = (files) => {
        if (files && files.length > 0) {
            setAvatarFile(files[0].file);
        } else {
            setAvatarFile(null);
        }
    };

    /**
     * Recursive helper to append nested objects/arrays to FormData.
     * This ensures 'seller', 'roles', etc. are sent correctly.
     */
    const buildFormData = (formData, data, parentKey) => {
        if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
            Object.keys(data).forEach(key => {
                const value = data[key];
                // Determine the key string for formData (e.g., "seller[store_name]")
                const formKey = parentKey ? `${parentKey}[${key}]` : key;

                buildFormData(formData, value, formKey);
            });
        } else {
            // Append primitive values or Files
            // Skip null or undefined to avoid sending "null" string
            if (data !== null && data !== undefined) {
                const value = typeof data === 'boolean' ? (data ? '1' : '0') : data;
                formData.append(parentKey, value);
            }
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!currentUserData || !currentUserData.id) {
                throw new Error('User data not loaded properly. Please refresh or log in.');
            }

            const userId = currentUserData.id;

            // 1. Merge Data
            const mergedData = {
                ...currentUserData,
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone_number: profile.phone_number,
            };

            // 2. Create FormData
            const formDataPayload = new FormData();

            // *** CRITICAL FIX: Method Spoofing ***
            // We add this so Laravel knows to treat this POST as a PUT
            formDataPayload.append('_method', 'PUT');

            // Separate photo from the rest
            const { profile_photo, ...dataWithoutPhoto } = mergedData;

            // Build the rest of the data
            buildFormData(formDataPayload, dataWithoutPhoto, '');

            // 3. Handle Photo
            if (avatarFile) {
                formDataPayload.append('profile_photo', avatarFile);
            }

            // 4. Send as POST (Important!)
            // We are passing a flag 'true' or using a different function to ensure 
            // the API layer uses axios.post, NOT axios.put
            await updateUserProfile(userId, formDataPayload);

            // 5. Update Storage
            const newStorageData = { data: mergedData };
            storageManager.setUserData(newStorageData);
            setCurrentUserData(mergedData);
            setAvatarFile(null);

            showSuccess('Profile updated successfully');

        } catch (error) {
            console.error(error);
            if (error.response?.data?.errors) {
                const errorMsg = Object.values(error.response.data.errors).flat().join('\n');
                showError(errorMsg);
            } else {
                showError(error.message || 'Failed to update profile');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderProfileTab = () => (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Photo Section */}
                <div className="w-full md:w-1/3 flex flex-col space-y-4">

                    {/* Visual check: Show Current Profile Photo if no NEW file selected */}
                    {!avatarFile && currentUserData?.profile_photo && typeof currentUserData.profile_photo === 'string' && (
                        <div className="flex flex-col items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 mb-2">Current Photo</span>
                            <img
                                src={currentUserData.profile_photo}
                                alt="Current Profile"
                                className="w-32 h-32 rounded-full object-cover border border-gray-200"
                            />
                        </div>
                    )}

                    <DocumentUpload
                        label="Upload Profile Photo"
                        maxSizeMB={2}
                        maxFiles={1}
                        acceptedTypes=".jpg,.jpeg,.png,.gif"
                        helperText="JPG, GIF or PNG. Max size 2MB"
                        value={avatarFile ? [{
                            name: avatarFile.name,
                            size: avatarFile.size,
                            type: avatarFile.type,
                            file: avatarFile,
                            id: 'temp-id',
                            preview: URL.createObjectURL(avatarFile)
                        }] : []}
                        onChange={handleDocumentChange}
                    />
                </div>

                {/* Form Fields */}
                <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            name="first_name"
                            value={profile.first_name}
                            onChange={handleInputChange}
                            icon={User}
                            placeholder="Enter your first name"
                        />
                        <Input
                            label="Last Name"
                            name="last_name"
                            value={profile.last_name}
                            onChange={handleInputChange}
                            icon={User}
                            placeholder="Enter your last name"
                        />
                    </div>

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        icon={User}
                        placeholder="name@example.com"
                        disabled={true}
                        className="bg-gray-50"
                    />

                    <Input
                        label="Phone Number"
                        name="phone_number"
                        type="tel"
                        value={profile.phone_number}
                        onChange={handleInputChange}
                        icon={User}
                        placeholder="+1 (555) 000-0000"
                    />

                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            icon={Save}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <div className="grid grid-cols-1 gap-4 max-w-md">
                <Input
                    label="Current Password"
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    endIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />
                <Input
                    label="New Password"
                    type="password"
                    icon={Lock}
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    icon={Lock}
                />
                <div className="pt-2">
                    <Button>Update Password</Button>
                </div>
            </div>
        </div>
    );

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
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
                            {activeTab === 'notifications' && <div className="text-center text-gray-500 py-12">Notification settings coming soon</div>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;