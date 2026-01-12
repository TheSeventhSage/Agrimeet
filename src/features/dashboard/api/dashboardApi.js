import { storageManager } from '../../../shared/utils/storageManager';

const API_BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

/**
 * A centralized API client for making authenticated fetch requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/seller/vendor_stats').
 * @returns {Promise<any>} - A promise that resolves with the JSON response.
 * @throws {Error} - Throws an error if the auth token is missing or if the API response is not ok.
 */
const apiClient = async (endpoint) => {
    const token = storageManager.getAccessToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    return response.json();
};

// --- Exported API Functions ---

export const getVendorStats = () => {
    return apiClient('/seller/vendor_stats');
};

export const getTopWeeklyProducts = () => {
    return apiClient('/seller/top_weekly_products');
};

export const getRecentWeeklyOrders = () => {
    return apiClient('/seller/recent_weekly_orders');
};

export const getTopWeeklyTransactions = () => {
    return apiClient('/seller/top_weekly_transactions');
};

/**
 * Fetches the full profile for a given user.
 * @param {number|string} userId - The ID of the user to fetch.
 * @returns {Promise<any>} - A promise that resolves with the user profile data.
 */
export const getUserProfile = (userId) => {
    if (!userId) {
        // Return a rejected promise if no ID is provided
        return Promise.reject(new Error('User ID is required to fetch profile.'));
    }
    // Assumes the endpoint is /user/{id} based on your documentation
    return apiClient(`/buyer/users/${userId}`);
};