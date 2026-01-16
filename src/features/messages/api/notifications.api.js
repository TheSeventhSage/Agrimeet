import { api } from '../../../shared/utils/apiClient';

/**
 * Get paginated seller notifications
 * @param {number} page - Current page number
 * @param {number} perPage - Items per page
 * @returns {Promise} - Notifications data with pagination
 */
export const getSellerNotifications = async (page = 1, perPage = 15) => {
    try {
        const response = await api.get('/seller/notifications', {
            query: {
                page,
                per_page: perPage,
            },
        });
        return response;
    } catch (error) {
        console.error('Error fetching seller notifications:', error);
        throw error;
    }
};

/**
 * Mark a specific notification as read
 * @param {string|number} id - Notification ID
 * @returns {Promise} - Updated notification data
 */
export const markNotificationAsRead = async (id) => {
    try {
        const response = await api.post(`/notifications/${id}/mark-as-read`);
        return response;
    } catch (error) {
        console.error(`Error marking notification ${id} as read:`, error);
        throw error;
    }
};

/**
 * Mark all notifications as read
 * @returns {Promise} - Success response
 */
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await api.post('/notifications/mark-all-read');
        return response;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
};

/**
 * Delete a specific notification
 * @param {string|number} id - Notification ID
 * @returns {Promise} - Success response
 */
export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`/notifications/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting notification ${id}:`, error);
        throw error;
    }
};

/**
 * Get notifications by type (optional feature)
 * @param {string} type - Notification type (orders, wallet, stock, kyc, reviews)
 * @param {number} page - Current page number
 * @param {number} perPage - Items per page
 * @returns {Promise} - Filtered notifications data
 */
export const getNotificationsByType = async (type, page = 1, perPage = 15) => {
    try {
        const response = await api.get(`/notifications/type/${type}`, {
            query: {
                page,
                per_page: perPage,
            },
        });
        return response;
    } catch (error) {
        console.error(`Error fetching ${type} notifications:`, error);
        throw error;
    }
};