import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, Settings, LogOut, UserCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storageManager } from '../utils/storageManager';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const user = storageManager.getUserData();
    // console.log(user.data.roles);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    const navigateTo = (path) => {
        navigate(`${path}`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    {user?.data?.profile_photo ? (
                        <img src={user?.data?.profile_photo} alt="User" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.data?.first_name || user.user || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.data?.roles?.includes('seller') ? 'Seller' : user?.data?.roles?.includes('admin') || user?.roles.includes('admin') ? 'Admin' : 'Inactive'}</p>
                </div>
                {(!user?.data?.roles?.includes('admin') && !user?.roles?.includes('admin')) && (
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50">

                    {(!user?.data?.roles?.includes('admin') && !user?.roles?.includes('admin')) && (
                        <div>
                            {/* User Info Header */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex min-w-0 items-center gap-3 w-full">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex shrink-0 items-center justify-center">
                                        {user?.data?.profile_photo ? (
                                            <img src={user?.data?.profile_photo} alt="User" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-white" />
                                        )}
                                    </div>
                                    <div className='w-full min-w-0'>
                                        <h3 className="w-fit font-semibold text-gray-900">{user?.data?.first_name || user.user || 'User'}</h3>
                                        <p className="text-sm text-gray-500 w-full truncate">{user?.data?.roles?.includes('seller') ? user?.data?.email : 'Platform Admin'}</p>
                                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                                            {user?.data?.roles?.includes('seller') ? 'Seller' : user?.data?.roles?.includes('admin') || user?.roles.includes('admin') ? 'Admin' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-2">
                                <button
                                    onClick={() => navigateTo('/profile')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    My Profile
                                </button>

                                <button
                                    onClick={() => navigateTo('/settings')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>

                                <button
                                    onClick={() => navigateTo('/help-support')}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    Help & Support
                                </button>
                            </div>
                        </div>
                    )}
                    {/* Logout */}
                    <div className="border-t border-gray-200 py-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;