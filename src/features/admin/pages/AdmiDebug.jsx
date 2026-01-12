import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { storageManager } from '../../../shared/utils/storageManager';
import { Shield, User, Key, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AdminDebug = () => {
    const [userData, setUserData] = useState(null);
    const [tokens, setTokens] = useState(null);
    const [normalizedRoles, setNormalizedRoles] = useState([]);

    useEffect(() => {
        loadDebugInfo();
    }, []);

    const loadDebugInfo = () => {
        const user = storageManager.getUserData();
        const tok = storageManager.getTokens();

        // Normalize roles
        const roles = user?.roles
            ? (Array.isArray(user.roles) ? user.roles : [user.roles])
            : (user?.role ? [user.role] : []);

        setUserData(user);
        setTokens(tok);
        setNormalizedRoles(roles);
    };

    const isAdmin = normalizedRoles.includes('admin');
    const isSeller = normalizedRoles.includes('seller');
    const isBuyer = normalizedRoles.includes('buyer');

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Debug Info</h1>
                    <p className="text-gray-600 mt-2">Check your authentication and role status</p>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`rounded-xl shadow-xs border p-6 ${isAdmin ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            {isAdmin ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                            <div>
                                <h3 className="font-semibold text-gray-900">Admin Access</h3>
                                <p className={`text-sm ${isAdmin ? 'text-green-700' : 'text-red-700'}`}>
                                    {isAdmin ? 'You have admin access ✓' : 'No admin access ✗'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl shadow-xs border p-6 ${isSeller ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-3">
                            {isSeller ? (
                                <CheckCircle className="w-8 h-8 text-blue-600" />
                            ) : (
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            )}
                            <div>
                                <h3 className="font-semibold text-gray-900">Seller Access</h3>
                                <p className={`text-sm ${isSeller ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {isSeller ? 'You have seller access' : 'No seller access'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl shadow-xs border p-6 ${tokens ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            {tokens ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <XCircle className="w-8 h-8 text-red-600" />
                            )}
                            <div>
                                <h3 className="font-semibold text-gray-900">Authentication</h3>
                                <p className={`text-sm ${tokens ? 'text-green-700' : 'text-red-700'}`}>
                                    {tokens ? 'Authenticated ✓' : 'Not authenticated ✗'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Data */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        User Data
                    </h2>
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(userData, null, 2)}
                    </pre>
                </div>

                {/* Roles Analysis */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Roles Analysis
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Original Role Field</label>
                                <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1">
                                    {userData?.role || 'null'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Original Roles Field</label>
                                <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1">
                                    {JSON.stringify(userData?.roles) || 'null'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Normalized Roles (Array)</label>
                                <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1">
                                    {JSON.stringify(normalizedRoles)}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Primary Role</label>
                                <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1">
                                    {normalizedRoles[0] || 'none'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Role Checks</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {isAdmin ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className="text-sm">Has Admin Role: {isAdmin ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isSeller ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                    <span className="text-sm">Has Seller Role: {isSeller ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isBuyer ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-gray-400" />
                                    )}
                                    <span className="text-sm">Has Buyer Role: {isBuyer ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Token Info */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Authentication Tokens
                    </h2>
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Access Token</label>
                            <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1 text-xs break-all">
                                {tokens?.access_token ?
                                    `${tokens.access_token.substring(0, 50)}...` :
                                    'No token found'}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Has Active Session</label>
                            <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded-sm mt-1">
                                {storageManager.hasActiveSession() ? 'true' : 'false'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Fix Instructions */}
                {!isAdmin && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">How to Fix Admin Access</h3>
                                <div className="text-sm text-gray-700 space-y-2">
                                    <p><strong>Option 1:</strong> Update your user account in the database to have 'admin' role</p>
                                    <p><strong>Option 2:</strong> The API login response should return:</p>
                                    <pre className="bg-white p-3 rounded-sm border border-yellow-200 mt-2 text-xs overflow-x-auto">
                                        {`{
  "access_token": "...",
  "role": "admin",        // Single role
  // OR
  "roles": ["admin"],     // Array of roles
  "user": "Admin Name",
  "email": "admin@example.com"
}`}</pre>
                                    <p className="mt-3"><strong>Option 3:</strong> Manually set in localStorage (temporary):</p>
                                    <button
                                        onClick={() => {
                                            const currentUser = storageManager.getUserData();
                                            const updatedUser = {
                                                ...currentUser,
                                                roles: ['admin'],
                                                role: 'admin'
                                            };
                                            storageManager.setUserData(updatedUser);
                                            window.location.reload();
                                        }}
                                        className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                    >
                                        Grant Admin Role (Temporary)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {isAdmin && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">✅ Admin Access Confirmed</h3>
                                <p className="text-sm text-gray-700">
                                    You have admin role and can access all admin pages! Navigate to any admin page from the sidebar.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminDebug;