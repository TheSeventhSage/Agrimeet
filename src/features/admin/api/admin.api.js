import { storageManager } from '../../../shared/utils/storageManager';

const BASE_URL = 'https://agrimeet.udehcoglobalfoodsltd.com/api/v1';

const getAuthToken = () => {
    return storageManager.getAccessToken() || '';
};

/**
 * Builds the standard headers for authorized requests.
 */
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAuthToken()}`,
});

/**
 * Handles and normalizes all fetch responses.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = { message: 'An unknown error occurred.' };
        }
        const error = new Error(errorData.message || `Error ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
    }

    if (response.status === 204) return null;
    return response.json();
};

/**
 * Safely extracts readable error messages.
 */
export const getErrorMessage = (error) => {
    if (error?.data?.message) return error.data.message;
    if (error?.message) return error.message;
    return 'Something went wrong. Please try again.';
};

// Helper function to build query parameters
const buildQueryParams = (params) => {
    const query = new URLSearchParams();
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            query.append(key, params[key]);
        }
    }
    return query.toString();
};

// ------------------------------
// Admin API Endpoints
// ------------------------------
export const adminApi = {
    // Platform overview stats
    async getPlatformStats() {
        const res = await fetch(`${BASE_URL}/admin/admin-platform-stats`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Consolidated statistics
    async getConsolidatedStats() {
        const res = await fetch(`${BASE_URL}/admin/admin-consolidated-stats`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Weekly revenue data
    async getWeeklyRevenue() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-revenue`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Total weekly revenue
    async getWeeklyTotalRevenue() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-total-revenue`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Weekly transactions summary
    async getWeeklyTransactions() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-total-transactions`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Weekly total products sold
    async getWeeklyProductsSold() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-total-products-sold`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Top weekly transactions
    async getTopWeeklyTransactions() {
        const res = await fetch(`${BASE_URL}/admin/admin-top-weekly-transactions`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Recent weekly orders
    async getRecentWeeklyOrders() {
        const res = await fetch(`${BASE_URL}/admin/admin-recent-weekly-orders`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Top weekly products
    async getTopWeeklyProducts() {
        const res = await fetch(`${BASE_URL}/admin/admin-top-weekly-products`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Weekly out-of-stock products
    async getWeeklyOutOfStock() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-out-of-stock`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // Weekly orders by state
    async getWeeklyOrdersByState() {
        const res = await fetch(`${BASE_URL}/admin/admin-weekly-orders-by-state`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    // --- NEW ENDPOINTS ---

    /**
     * GET /admin/admin-sold-products
     * Get top sold products with optional filters.
     * @param {object} filters - { day_of_week, month, year, last_days }
     */
    async getSoldProducts(filters = {}) {
        const params = buildQueryParams(filters);
        const url = `${BASE_URL}/admin/admin-sold-products${params ? '?' + params : ''}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * GET /admin/admin-top-categories
     * Get top selling categories with optional filters.
     * @param {object} filters - { day_of_week, month, year, last_days }
     */
    async getTopCategories(filters = {}) {
        const params = buildQueryParams(filters);
        const url = `${BASE_URL}/admin/admin-top-categories${params ? '?' + params : ''}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },

    /**
     * GET /admin/admin-monthly-revenue
     * Get revenue by month with flexible filters.
     * @param {object} filters - { filter: '24hours' | 'days' | 'last7days' | 'month' | 'year', months: number, days: number }
     */
    async getMonthlyRevenue(filters = {}) {
        const params = buildQueryParams(filters);
        const url = `${BASE_URL}/admin/admin-monthly-revenue${params ? '?' + params : ''}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(res);
    },
};