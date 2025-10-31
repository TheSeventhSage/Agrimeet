// admin/api/adminUserService.js
import { api } from '../../../../shared/utils/apiClient';

/**
 * Get all customers with filters and pagination
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @param {object} filters - Filter options (search_global, status, sortBy, sortOrder)
 * @returns {Promise} - Customers data with pagination
 */
export const getAllCustomers = async (page = 1, perPage = 20, filters = {}) => {
    try {
        const params = {
            page,
            per_page: perPage,
            ...(filters.search_global && { search_global: filters.search_global }),
            ...(filters.status && filters.status !== 'all' && { status: filters.status }),
            ...(filters.sortBy && { sortBy: filters.sortBy }),
            ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        };

        const response = await api.get('/admin/allCustomers', {
            searchParams: params,
        });
        return response;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

/**
 * Suspend a user account
 * @param {number} userId - User ID
 * @param {string} reason - Suspension reason (optional)
 * @returns {Promise} - Updated user data
 */
export const suspendUser = async (userId, reason = '') => {
    try {
        const response = await api.post(`/admin/users/${userId}/suspend`, {
            reason,
        });
        return response;
    } catch (error) {
        console.error(`Error suspending user ${userId}:`, error);
        throw error;
    }
};

/**
 * Unsuspend a user account
 * @param {number} userId - User ID
 * @returns {Promise} - Updated user data
 */
export const unsuspendUser = async (userId) => {
    try {
        const response = await api.post(`/admin/users/${userId}/unsuspend`);
        return response;
    } catch (error) {
        console.error(`Error unsuspending user ${userId}:`, error);
        throw error;
    }
};

/**
 * Get user statistics
 * @returns {Promise} - User statistics
 */
export const getUserStats = async () => {
    try {
        // Note: This endpoint might need to be added to your API
        // For now, we'll calculate stats from the customers list
        const response = await api.get('/admin/allCustomers', {
            searchParams: { per_page: 1 },
        });
        return response;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

export default {
    getAllCustomers,
    suspendUser,
    unsuspendUser,
    getUserStats,
};