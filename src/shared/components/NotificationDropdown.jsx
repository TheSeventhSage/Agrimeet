import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, ShoppingCart, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storageManager } from '../../shared/utils/storageManager';

// Import BOTH APIs
import { getSellerNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../features/messages/api/notifications.api';
import { adminNotificationsApi } from '../../features/admin/notifications/api/adminNotifications.api';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Determine user role
    const user = storageManager.getUserData();
    // Helper to check roles safely (handles array or string)
    const roles = Array.isArray(user?.roles) ? user.roles : [user?.role];
    const isAdmin = roles.includes('admin');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            // Select API based on role
            if (isAdmin) {
                // Admin Flow
                const [listRes, countRes] = await Promise.all([
                    adminNotificationsApi.getNotifications(1, 5),
                    adminNotificationsApi.getUnreadCount()
                ]);

                const list = listRes.data?.notifications || listRes.data?.data || [];
                // Admin API for unread count usually returns { count: X } or similar
                const count = countRes.data?.count || countRes.count || 0;

                setNotifications(list);
                setUnreadCount(count);

            } else {
                // Seller Flow (Existing logic)
                const response = await getSellerNotifications(1, 5);
                if (response?.data?.success && response?.data?.data) {
                    setNotifications(response.data.data.notifications);
                    setUnreadCount(response.data.data.unread_count);
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            if (isAdmin) {
                await adminNotificationsApi.markAsRead(id);
            } else {
                await markNotificationAsRead(id);
            }

            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            if (isAdmin) {
                await adminNotificationsApi.markAllAsRead();
            } else {
                await markAllNotificationsAsRead();
            }

            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const recentNotifications = notifications.slice(0, 5);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Icon helper
    const getIcon = (type) => {
        if (!type) return <Info className="w-5 h-5 text-blue-500" />;
        if (type.includes('Order')) return <ShoppingCart className="w-5 h-5 text-brand-500" />;
        if (type.includes('Stock') || type.includes('Product')) return <Package className="w-5 h-5 text-orange-500" />;
        if (type.includes('Alert') || type.includes('Warning')) return <AlertCircle className="w-5 h-5 text-red-500" />;
        return <Info className="w-5 h-5 text-blue-500" />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-brand-100 text-brand-700 text-xs font-medium rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read_at ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1 flex-shrink-0">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!notification.read_at ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!notification.read_at ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.data?.title || 'Notification'}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                                                    {notification.data?.message || notification.data?.body}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(notification.created_at).toLocaleString([], {
                                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="ml-2 p-1 hover:bg-gray-200 rounded-sm"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-3 h-3 text-gray-400" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 text-center border-t border-gray-200">
                        <Link
                            to={isAdmin ? "/admin/notifications" : "/seller/messages"} // Route based on role
                            className="w-full text-sm text-brand-600 hover:text-brand-700 font-medium block"
                            onClick={() => setIsOpen(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;