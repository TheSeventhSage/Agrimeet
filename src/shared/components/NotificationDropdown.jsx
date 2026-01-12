import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, ShoppingCart, Package } from 'lucide-react';
import { getSellerNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../features/messages/api/notifications.api';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getSellerNotifications(1, 5);

            if (response?.data?.success && response?.data?.data) {
                setNotifications(response.data.data.notifications);
                setUnreadCount(response.data.data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const recentNotifications = notifications.slice(0,5)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification
                )
            );

            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications(prev =>
                prev.map(notification => ({ ...notification, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            order: ShoppingCart,
            stock: Package,
            info: Info
        };
        return icons[type] || AlertCircle;
    };

    const getNotificationColor = (type) => {
        const colors = {
            order: 'text-green-600 bg-green-100',
            stock: 'text-yellow-600 bg-yellow-100',
            info: 'text-blue-600 bg-blue-100'
        };
        return colors[type] || 'text-gray-600 bg-gray-100';
    };

    return (
        <div ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <Bell className="w-5 h-5" />

                {/* The new element for the pulsing effect - only show if unreadCount > 0 */}
                {unreadCount > 0 && (
                    <span className="absolute top-[5px] right-[7px] flex justify-center h-[10px] w-[10px] z-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-[20px] mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Mark all read
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-sm"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {recentNotifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                    {recentNotifications.map((notification) => {
                                    const IconComponent = getNotificationIcon(notification.type);
                                    const isUnread = !notification.read_at;

                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => isUnread && markAsRead(notification.id)}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {notification.data?.message || notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Order #{notification.data?.order_number}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(notification.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {isUnread && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="ml-2 p-1 hover:bg-gray-200 rounded-sm"
                                                            >
                                                                <Check className="w-3 h-3 text-gray-400" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 text-center border-t border-gray-200">
                        <Link to="/notifications" className="w-full  text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;