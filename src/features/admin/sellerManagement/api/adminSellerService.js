// admin/api/adminSellerService.js
import { api } from '../../../../shared/utils/apiClient';
import { suspendUser, unsuspendUser } from '../../userManagement/api/adminUserService';

/**
 * Get all sellers with filters and pagination
 * @param {number} page - Page number
 * @param {number} perPage - Items per page
 * @param {object} filters - Filter options
 * @returns {Promise} - Sellers data with pagination
 */
export const getAllSellers = async (page = 1, perPage = 20, filters = {}) => {
    try {
        const params = {
            page,
            per_page: perPage,
        };

        // Safe access to filters
        const activeFilters = filters || {};

        // 1. Search Global: Only add if it has actual text
        if (activeFilters.search_global && activeFilters.search_global.trim().length > 0) {
            params.search_global = activeFilters.search_global.trim();
        }

        // 2. Status: Only add if specific status is selected (not 'all' or empty)
        if (activeFilters.status && activeFilters.status !== 'all') {
            params.status = activeFilters.status;
        }

        // 3. Business Type: Only add if specific type is selected (not 'all' or empty)
        if (activeFilters.business_type && activeFilters.business_type !== 'all') {
            params.business_type = activeFilters.business_type;
        }

        // 4. Sorting: Only add if defined
        if (activeFilters.sortBy) {
            params.sortBy = activeFilters.sortBy;
        }

        if (activeFilters.sortOrder) {
            params.sortOrder = activeFilters.sortOrder;
        }

        // The request will now strictly look like: /admin/allsellers?page=1&per_page=20
        // unless a specific filter is actually active.
        const response = await api.get('/admin/allsellers', { query: params });

        return response.data; // Ensure we return the data property directly if that's what the component expects
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
            query: { per_page: 1 },
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

/**
 * Review a seller's KYC submission
 * @param {number} submissionId - The ID of the KYC submission
 * @param {Object} data - { status: 'approved' | 'rejected', admin_notes: string }
 * @returns {Promise}
 */
export const reviewKyc = async (submissionId, data) => {
    try {
        const response = await api.post(`/admin/kyc/${submissionId}/review`, data);
        return response.data;
    } catch (error) {
        console.error(`Error reviewing KYC ${submissionId}:`, error);
        throw error;
    }
};

export default {
    getAllSellers,
    getSellerById,
    suspendSeller,
    unsuspendSeller,
    getSellerStats,
    getBusinessTypes,
    reviewKyc,
};