import { storageManager } from "../../../../shared/utils/storageManager";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get token
const getToken = () => storageManager.getAccessToken();

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || error.error || 'Request failed');
    }
    return response.json();
};

export const adminNotificationsApi = {
    // --- GENERAL ENDPOINTS (For the Admin's own inbox) ---

    // Get all notifications for the logged-in admin
    getNotifications: async (page = 1, per_page = 15) => {
        const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&per_page=${per_page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Mark specific notification as read
    markAsRead: async (id) => {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}/mark-as-read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Mark all as read
    markAllAsRead: async () => {
        const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Delete notification
    deleteNotification: async (id) => {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // --- ADMIN SPECIFIC ENDPOINTS (Broadcasting & Management) ---

    getWithdrawalNotifications: async (page = 1, per_page = 15) => {
        const response = await fetch(`${API_BASE_URL}/admin/notifications/withdrawals?page=${page}&per_page=${per_page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Send notification (to specific user or all)
    sendNotification: async (data) => {
        // data structure: { title, body, user_id (optional), type: 'info'|'warning'|etc }
        const response = await fetch(`${API_BASE_URL}/admin/notifications/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Get history of sent notifications
    getNotificationHistory: async (page = 1) => {
        const response = await fetch(`${API_BASE_URL}/admin/notifications/history?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    },

    // Get stats
    getNotificationStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/notifications/stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Accept': 'application/json'
            }
        });
        return handleResponse(response);
    }
};