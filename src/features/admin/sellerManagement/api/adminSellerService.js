// admin/api/adminSellerService.js
import { api } from '../../../../shared/utils/apiClient';
import { suspendUser, unsuspendUser } from '../../userManagement/api/adminUserService';

/**
 * Get all sellers with filters and pagination
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @param {object} filters - Filter options (search_global, status, business_type, sortBy, sortOrder)
 * @returns {Promise} - Sellers data with pagination
 */
export const getAllSellers = async (page = 1, perPage = 20, filters = {}) => {
    try {
        const params = {
            page,
            per_page: perPage,
        };

        // Only add filters if they have values and are not 'all'
        if (filters.search_global && filters.search_global.trim()) {
            params.search_global = filters.search_global.trim();
        }

        if (filters.status && filters.status !== 'all') {
            params.status = filters.status;
        }

        if (filters.business_type && filters.business_type !== 'all') {
            params.business_type = filters.business_type;
        }

        if (filters.sortBy) {
            params.sortBy = filters.sortBy;
        }

        if (filters.sortOrder) {
            params.sortOrder = filters.sortOrder;
        }

        const response = await api.get(`/admin/allsellers?${params.toString()}`, {
            config: params,
        });
        return response;
    } catch (error) {
        console.error('Error fetching sellers:', error);
        throw error;
    }
};

/**
 * Get seller by ID
 * @param {number} sellerId - Seller ID
 * @returns {Promise} - Seller details
 */
export const getSellerById = async (sellerId) => {
    try {
        const response = await api.get(`/admin/sellers/${sellerId}`);
        return response;
    } catch (error) {
        console.error(`Error fetching seller ${sellerId}:`, error);
        throw error;
    }
};

/**
 * Suspend a seller's user account (reuses adminUserService)
 * @param {number} userId - User ID
 * @param {string} reason - Suspension reason (optional)
 * @returns {Promise} - Updated user data
 */
export const suspendSeller = suspendUser;

/**
 * Unsuspend a seller's user account (reuses adminUserService)
 * @param {number} userId - User ID
 * @returns {Promise} - Updated user data
 */
export const unsuspendSeller = unsuspendUser;

/**
 * Get seller statistics
 * @returns {Promise} - Seller statistics
 */
export const getSellerStats = async () => {
    try {
        const response = await api.get('/admin/allsellers', {
            searchParams: { per_page: 1 },
        });
        return response;
    } catch (error) {
        console.error('Error fetching seller stats:', error);
        throw error;
    }
};

/**
 * Get business types for filter dropdown
 * @returns {Promise} - Business types list
 */
export const getBusinessTypes = async () => {
    try {
        const response = await api.get('/admin/business_types');
        return response;
    } catch (error) {
        console.error('Error fetching business types:', error);
        return { data: [] };
    }
};

export default {
    getAllSellers,
    getSellerById,
    suspendSeller,
    unsuspendSeller,
    getSellerStats,
    getBusinessTypes,
};