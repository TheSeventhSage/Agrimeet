import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, ShoppingCart, Package } from 'lucide-react';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'You have received a new order #12345 for $150.00',
            time: '2 minutes ago',
            read: false,
            icon: ShoppingCart
        },
        {
            id: 2,
            type: 'stock',
            title: 'Low Stock Alert',
            message: 'Product "Men Black T-shirt" is running low (5 items left)',
            time: '1 hour ago',
            read: false,
            icon: Package
        },
        {
            id: 3,
            type: 'info',
            title: 'System Update',
            message: 'Your dashboard has been updated with new features',
            time: '3 hours ago',
            read: true,
            icon: Info
        }
    ]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const getNotificationIcon = (type) => {
        const notification = notifications.find(n => n.type === type);
        return notification ? notification.icon : AlertCircle;
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
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => {
                                    const IconComponent = notification.icon;
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="ml-2 p-1 hover:bg-gray-200 rounded"
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
                    <div className="p-3 border-t border-gray-200">
                        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
