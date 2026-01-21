import {
    Bell,
    Package,
    ShoppingCart,
    CreditCard,
    Star,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    RefreshCw,
    Check,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { LoadingSpinner, PageLoader } from '../../../shared/components/Loader';
import { showError, showSuccess } from '../../../shared/utils/alert';
import { getSellerNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../api/notifications.api';

// --- Helper Functions ---
const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }
    return 'Just now';
};

const getNotificationIcon = (type) => {
    const iconMap = {
        new_order: ShoppingCart,
        order: ShoppingCart,
        orders: ShoppingCart,
        seller_payment_confirmed: CreditCard,
        wallet: CreditCard,
        payment: CreditCard,
        stock: Package,
        inventory: Package,
        kyc: AlertCircle,
        verification: AlertCircle,
        review: Star,
        reviews: Star,
        system: Bell,
        success: CheckCircle,
        info: AlertCircle,
        trending: TrendingUp,
    };

    return iconMap[type?.toLowerCase()] || Bell;
};

const getNotificationColor = (type) => {
    const colorMap = {
        new_order: 'bg-blue-100 text-blue-600',
        order: 'bg-blue-100 text-blue-600',
        orders: 'bg-blue-100 text-blue-600',
        seller_payment_confirmed: 'bg-green-100 text-green-600',
        wallet: 'bg-green-100 text-green-600',
        payment: 'bg-green-100 text-green-600',
        stock: 'bg-purple-100 text-purple-600',
        inventory: 'bg-purple-100 text-purple-600',
        kyc: 'bg-yellow-100 text-yellow-600',
        verification: 'bg-yellow-100 text-yellow-600',
        review: 'bg-orange-100 text-orange-600',
        reviews: 'bg-orange-100 text-orange-600',
        system: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-600',
        info: 'bg-blue-100 text-blue-600',
        trending: 'bg-brand-100 text-brand-600',
    };

    return colorMap[type?.toLowerCase()] || 'bg-gray-100 text-gray-600';
};

const getNotificationTitle = (notification) => {
    const notificationType = notification.data?.type || '';
    const orderNumber = notification.data?.order_number || '';

    switch (notificationType) {
        case 'new_order':
            return `New Order ${orderNumber}`;
        case 'seller_payment_confirmed':
            return `Payment Confirmed - ${orderNumber}`;
        default:
            return notificationType.split('_').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
    }
};

const Notifications = () => {
    // --- State Management ---
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 15,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    // --- Data Fetching ---
    const fetchNotifications = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await getSellerNotifications(page, pagination.per_page);

            const responseData = response.data;

            if (responseData && responseData.success && responseData.data) {
                setNotifications(responseData.data.notifications || []);
                setUnreadCount(responseData.data.unread_count || 0);
                setPagination(responseData.data.pagination || pagination);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                showError('Session expired. Please login again.');
                window.location.href = '/login';
            } else {
                showError('Failed to load notifications. Please try again.');
            }
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // --- Action Handlers ---
    const handleMarkAsRead = async (notificationId) => {
        setActionLoading(notificationId);
        try {
            const response = await markNotificationAsRead(notificationId);
            console.log('Mark as read response:', response);

            // Refetch to get the updated data from server
            await fetchNotifications(pagination.current_page);
            showSuccess('Notification marked as read');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            showError('Failed to mark notification as read');
            // Still refetch to sync with server state
            await fetchNotifications(pagination.current_page);
        } finally {
            setActionLoading(null);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        setActionLoading('mark-all');
        try {
            const response = await markAllNotificationsAsRead();
            console.log('Mark all as read response:', response);

            // Refetch to get the updated data from server
            await fetchNotifications(pagination.current_page);
            showSuccess('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            showError('Failed to mark all notifications as read');
            // Still refetch to sync with server state
            await fetchNotifications(pagination.current_page);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (notificationId) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;

        setActionLoading(notificationId);
        try {
            const response = await deleteNotification(notificationId);
            console.log('Delete notification response:', response);

            // Refetch to get the updated data from server
            await fetchNotifications(pagination.current_page);
            showSuccess('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            showError('Failed to delete notification');
            // Still refetch to sync with server state
            await fetchNotifications(pagination.current_page);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRefresh = () => {
        fetchNotifications(pagination.current_page);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.last_page) {
            fetchNotifications(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- Loading State ---
    if (isInitialLoading) {
        return <PageLoader message="Loading your notifications..." />;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between flex-col gap-4 px-4 md:items-center md:flex-row md:px-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-600 mt-2">
                            Stay updated with your business activities
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-lg">
                                <Bell className="w-4 h-4 text-brand-600" />
                                <span className="text-sm font-semibold text-brand-600">
                                    {unreadCount} Unread
                                </span>
                            </div>
                        )}
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={actionLoading === 'mark-all'}
                                className="flex  items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === 'mark-all' ? (
                                    <LoadingSpinner size="sm" message='' />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-gray-600" />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    Mark All Read
                                </span>
                            </button>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="text-sm font-medium">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-100">
                    {isLoading && !isInitialLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <LoadingSpinner size="lg" message="Loading notifications..." />
                        </div>
                    ) : notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => {
                                const notifData = notification.data || {};
                                const notifType = notifData.type || '';
                                const Icon = getNotificationIcon(notifType);
                                const colorClass = getNotificationColor(notifType);
                                const isUnread = !notification.read_at;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-6 hover:bg-gray-50 transition-colors ${isUnread ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex flex-col items-start gap-4 md:flex-row">
                                            {/* Icon */}
                                            <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                                                <Icon className="w-5 h-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex md:flex-row flex-col items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {getNotificationTitle(notification)}
                                                            </h3>
                                                            {isUnread && (
                                                                <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 text-sm leading-relaxed mb-2 break-all">
                                                            {notifData.message || 'No message available'}
                                                        </p>

                                                        {/* Display products if available */}
                                                        {notifData.products && notifData.products.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-2">
                                                                {notifData.products.map((product, idx) => (
                                                                    <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                                                                        {product.thumbnail && (
                                                                            <img
                                                                                src={product.thumbnail}
                                                                                alt={product.name}
                                                                                className="w-6 h-6 rounded object-cover"
                                                                            />
                                                                        )}
                                                                        <span className="text-xs text-gray-700">
                                                                            {product.name} {product.variant_name ? `(${product.variant_name})` : ''} × {product.quantity}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span>{formatTimeAgo(notification.created_at)}</span>
                                                            {notifType && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="capitalize">
                                                                        {notifType.replace(/_/g, ' ')}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {notifData.customer_name && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Customer: {notifData.customer_name}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {isUnread && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                disabled={actionLoading === notification.id}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title="Mark as read"
                                                            >
                                                                {actionLoading === notification.id ? (
                                                                    <LoadingSpinner size="sm" />
                                                                ) : (
                                                                    <Check className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification.id)}
                                                            disabled={actionLoading === notification.id}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="p-4 bg-green-50 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                You're All Caught Up!
                            </h3>
                            <p className="text-gray-600 text-center max-w-md">
                                No new notifications. Check back later for updates on orders, payments, and more.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.length > 0 && pagination.last_page > 1 && (
                        <div className="flex flex-col gap-2 items-center justify-between px-6 py-4 border-t border-gray-100 md:flex-row md:gap-0">
                            <div className="text-sm text-gray-600">
                                Page {pagination.current_page} of {pagination.last_page}
                                <span className="ml-2 text-gray-500">
                                    ({pagination.total} total notifications)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1 || isLoading}
                                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="text-sm font-medium">Previous</span>
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page || isLoading}
                                    className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="text-sm font-medium">Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;